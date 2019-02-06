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
const securityCheck = require('../security-check')
const getTemplateStorage = require('../get-template-storage')
const formatTemplateLink = require('../format-template-link')


module.exports = async (options = {}) => {
  const {
    cwd = process.cwd(),
    // project name
    name,
    // whether to skip the security check
    force = false,
    // template version expected
    version,
  } = options

  // template repository
  const repository = formatTemplateLink(options.repository, cwd)
  if (!force) await securityCheck(process.cwd())

  const templateStoragePath = await getTemplateStorage(repository)
  const revertTemplateRepository = await getTemplate(repository, templateStoragePath, version)

  try {
    const templateConfig = await loadTemplateConfig(templateStoragePath)
    const baseInfo = await extractProgectBaseInfo(cwd)

    const view = checkAndFormatView({
      name: name || baseInfo.name || basename(process.cwd()),
      repository: baseInfo.repository,
      remotes: baseInfo.remotes,
      template: { repository, version: templateConfig.version },
    })


    let files = await genFileList(cwd, templateConfig)
    files = files.map(file => ({ ...file, view }))


    log.info('initial folders...')
    await initialFolder(files)

    log.info('copy files...')
    await Promise.all(files.map(copy))
    await genMilirc(cwd, view)

    await templateConfig.hooks('afterInit')
  } finally {
    await revertTemplateRepository()
  }
}
