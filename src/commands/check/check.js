const loadConfig = require('../../load-config')
const downloadTemplate = require('../../download-template')
const getTemplateVersions = require('../../get-template-versions')
const applyTemplate = require('../../apply-template')
const log = require('../../utils/log')
const throwError = require('../../utils/throw-error')
const prompt = require('../../prompt')
const checkParams = require('../../check-params')


module.exports = async(options = {}) => {
  const {
    diff = false,
    fold = false,
    cwd = process.cwd(),
    noDeps = false,
  } = options

  let config = await loadConfig({ cwd, operation: 'upgrade' })

  const versions = await getTemplateVersions(config.template.repository)
  let version

  if (versions.length) {
    if (config.template.version) {
      version = versions.find(v => v.number === config.template.version.number)
      if (!version) {
        throwError([
          'No corresponding template version was found',
          'Please confirm that the version number exists in the tags of the template repository.',
          `Expected template version: ${version}(get from .milirc)`,
        ].join('\n'))
      }
    } else {
      throwError([
        'Cannot get template version from the .milirc for the project',
        'mili check should specify a version.',
        'and if you want use the latest version, run mili upgrade',
      ].join('\n'))
    }
  } else {
    log.warn([
      'The template repository is not versioned. And will use the default branch/file.',
    ].join('\n'))
  }

  await downloadTemplate(config.template.repository, version, noDeps)
  config = await config.reload({
    templateVersion: version,
    loadTemplate: true,
  })
  checkParams.engine(config)

  await prompt(config)
  await applyTemplate(config, { check: true, diff, fold })
  await config.template.hooks('afterCheck')

  log.info('check completed')
}
