#!/usr/bin/env node
const cosmiconfig = require('cosmiconfig')
const fs = require('fs-extra')
const { join } = require('path')
const throwError = require('./throwError')
const sa = require('sanitization')
const semver = require('semver')
const hooksEngine = require('./hooksEngine')
const { version: miliVersion } = require('../package.json')


const loadPackageJson = async templatePath => {
  const path = join(templatePath, 'package.json')

  try {
    await fs.access(path, fs.constants.R_OK)
    return await fs.readJson(path)
  } catch(err) {
    throwError(`Failed to load template package.json file:\n${err.message}`)
  }
}

const loadEntryFile = async entryPath => {
  try {
    const result =  await cosmiconfig('template').load(entryPath)
    return result.config
  } catch(err) {
    throwError(`Failed to load template entry file:\n${err.message}`)
  }
}

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
})

module.exports = async templatePath => {
  const packageJson = await loadPackageJson(templatePath)

  if (!semver.valid(packageJson.version)) throwError('The version number of the template does not conform to the semver specification')

  const entryPath = join(templatePath, packageJson.main)

  let config = await loadEntryFile(entryPath)

  try {
    config = checkConfig(config)
  } catch(e) {
    throwError('Template configuration error')
  }

  if (config.engines && semver.validRange(config.engines)) {
    if (!semver.satisfies(miliVersion, config.engines)) {
      if (semver.ltr(miliVersion, config.engines)) {
        throwError([
          'Your mili version is lower than the minimum version required by the template.',
          'Please upgrade the mili version first.',
          `Mili version range：${config.engines}`,
        ].join('\n'))
      } else {
        throwError([
          'Your mili version is higher than the maximum version required by the template.',
          'Please downgrade the mili version first.',
          `Mili version range：${config.engines}`,
        ].join('\n'))
      }
    }
  }

  config.rules = config.rules
    .map(rule => {
      rule.path = join(templatePath, config.path, rule.path)
      if (rule.handlers) rule.handlers = rule.handlers
      else if (rule.handler) rule.handlers = [rule.handler]
      else rule.handlers = []
      return rule
    })

  config.hooks = hooksEngine(config.hooks)
  config.path = join(templatePath, config.path)

  return { ...config, version: packageJson.version }
}
