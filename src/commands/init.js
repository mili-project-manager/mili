const loadConfig = require('../load-config')
const downloadTemplate = require('../download-template')
const getTemplateVersions = require('../get-template-versions')
const throwError = require('../utils/throw-error')
const applyTemplate = require('../apply-template')
const securityCheck = require('../security-check')
const checkParams = require('../check-params')
const { basename } = require('path')


module.exports = async (options = {}) => {
  const cwd = options.cwd || process.cwd()
  const name = options.name || basename(cwd)
  const repository = options.repository
  let version = options.version

  if (!options.force) await securityCheck(process.cwd())
  if (version) checkParams.version(version)

  let config = await loadConfig({
    cwd,
    projectName: name,
    templateRepository: repository,
  })

  const versions = await getTemplateVersions(config.template.repository)
  if (version) {
    version = versions.find(v => v.number === version)
    if (!version) {
      throwError([
        'No corresponding template version was found',
        'Please confirm that the version number exists in the tags of the template repository.',
        `Expected template version: ${version}`
      ].join('\n'))
    }
  } else {
    version = versions[0]
  }


  await downloadTemplate(config.template.repository, version)

  config = await config.reload({
    templateVersion: version,
  })

  if (config.template.status !== 'loaded') {
    throwError([
      'The template configuration file could not be loaded',
      'Please check the template entry file for errors that make it unloadable'
    ].join('\n'))
  }

  await applyTemplate(cwd, config)
  await config.template.hooks('afterInit')
}
