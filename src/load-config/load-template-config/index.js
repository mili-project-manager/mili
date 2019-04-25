const fs = require('fs-extra')
const { join } = require('path')
const cosmiconfig = require('cosmiconfig')
const sa = require('sanitization')
const loadMilirc = require('../load-milirc')
const loadPackageJson = require('../load-package-json')
const formatRepository = require('../../utils/format-repository')
const getLocalStoragePath = require('../../utils/get-local-storage-path')
const formatHooks = require('./format-hooks')
const formatRule = require('./format-rule')
const throwError = require('../../utils/throw-error')
const isDirectory = require('../../utils/is-directory')
const searchFile = require('./search-files')
const sha1 = require('sha1')


const checkConfig = sa.keys({
  path: sa.string.required,
  encoding: sa.string.defaulted('utf8'),
  engines: sa.string.required,
  rules: sa.each({
    path: sa.string.required,
    upgrade: sa.valid(['cover', 'keep', 'exist', 'merge']),
    glob: sa.bool.defaulted(true),
    handler: sa.any,
    handlers: sa.array,
  }),
  hooks: sa.object,
  interaction: sa.array,
})

const loadEntryFile = async path => {
  try {
    const packageJson = await loadPackageJson(path)
    let entryFilePath = join(path, 'entry.js')
    if (packageJson && typeof packageJson.main === 'string') entryFilePath = join(path, packageJson.main)

    const result =  await cosmiconfig('template').load(entryFilePath)
    const config = checkConfig(result.config)

    config.rules = config.rules
      .map(rule => {
        rule.path = join(config.path, rule.path)
        if (rule.handlers) rule.handlers = rule.handlers
        else if (rule.handler) rule.handlers = [rule.handler]
        else rule.handlers = []
        return rule
      })


    return config
  } catch(err) {
    throwError(`Failed to load template entry file:\n${err.message}`)
  }
}


module.exports = async (repository, version, load = false) => {
  const milirc = await loadMilirc()

  if (!repository) {
    if (milirc.template && milirc.template.repository) repository = milirc.template.repository
    else throw new Error('Unable to find template repository, please check whether milirc is configured correctly')
  }

  if (!version && milirc.template && milirc.template.version) {
    version = {
      number: milirc.template.version
    }
  }

  const config = {
    status: 'prepare',
    version: version || null,
    repository: formatRepository(repository),
    engines: null,
    path: null,
    rules: null,
    interaction: [],
    interactionSHA1: '',
  }

  if (!load) return config

  const localStoragePath = await getLocalStoragePath(config.repository, config.version)
  if (!await fs.pathExists(localStoragePath)) return config

  const packageJson = await loadPackageJson(localStoragePath)

  const entryFile = await loadEntryFile(localStoragePath)
  config.name = entryFile.name || packageJson.name || ''
  config.version = version
  config.engines = entryFile.engines

  config.path = join(localStoragePath, entryFile.path)
  if (!await isDirectory(config.path)) throwError('The template path should be a folder')

  config.rules = entryFile.rules.map(rule => {
    rule.path = join(localStoragePath, rule.path)
    return formatRule(rule)
  })

  config.interaction = entryFile.interaction
  config.interactionSHA1 = sha1(JSON.stringify(entryFile.interaction))
  config.hooks = formatHooks(entryFile.hooks)

  config.files = await searchFile(config)
  config.status = 'loaded'
  return config
}
