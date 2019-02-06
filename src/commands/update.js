const loadMiliConfig = require('../load-mili-config')
const getTemplate = require('../get-template')
const loadTemplateConfig = require('../load-template-config')
const extractProgectBaseInfo = require('../extract-progect-base-info')
const genFileList = require('../gen-file-list')
const initialFolder = require('../initial-folder')
const checkAndFormatView = require('../check-and-format-view')
const genMilirc = require('../gen-milirc')
const copy = require('../copy')
const log = require('../log')
const { join, basename } = require('path')
const semver = require('semver')
const throwError = require('../throw-error')
const securityCheck = require('../security-check')
const getTemplateStorage = require('../get-template-storage')


module.exports = async (options) => {
  const {
    cwd = process.cwd(),
    // whether to skip the security check
    force = false,
    // template version expected
    version,
  } = options

  if (!force) await securityCheck(process.cwd())


  const miliConfig = await loadMiliConfig()
  const repository = miliConfig.repository

  if (!force && version && semver.lt(version, miliConfig.version)) {
    throwError([
      'The version number setted is lower than the current template version.',
      "If you're sure you want to run this command, rerun it with --force.",
    ].join('\n'))
  }

  const templateStoragePath = await getTemplateStorage(repository)
  const revertTemplateRepository = await getTemplate(repository, templateStoragePath, version || miliConfig.version)


  try {
    const templateConfig = await loadTemplateConfig(templateStoragePath)

    const baseInfo = await extractProgectBaseInfo(join(process.cwd()))

    // basename(process.cwd())
    // OPTIMIZE: Check mili version and remind user
    // if (templateConfig.version > mili.version)

    const view = checkAndFormatView({
      name: baseInfo.name || basename(process.cwd()),
      repository: baseInfo.repository,
      remotes: baseInfo.remotes,
      template: { repository, version: templateConfig.version },
    })

    let files = await genFileList(cwd, templateConfig)
    files = files
      .filter(file => file.upgrade !== 'keep')
      .map(file => ({ ...file, view }))


    log.info('ensure folders...')
    await initialFolder(files)

    log.info('updating...')
    await Promise.all(files.map(copy))
    await genMilirc(cwd, view)

    await templateConfig.hooks('afterUpdate')
  } finally {
    await revertTemplateRepository()
  }
}
