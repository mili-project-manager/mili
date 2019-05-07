const loadConfig = require('../../load-config')
const semver = require('semver')
const downloadTemplate = require('../../download-template')
const getTemplateVersions = require('../../get-template-versions')
const applyTemplate = require('../../apply-template')
const securityCheck = require('../../security-check')
const log = require('../../utils/log')
const prompt = require('../../prompt')
const checkParams = require('../../check-params')


module.exports = async(options = {}) => {
  const {
    cwd = process.cwd(),
    // whether to skip the security check
    force = false,
    noDeps = false,
  } = options

  if (!force) await securityCheck(process.cwd())
  let config = await loadConfig({ cwd, operation: 'upgrade' })


  const versions = await getTemplateVersions(config.template.repository)

  if (versions.length) {
    if (semver.gte(config.template.version.number, versions[0].number)) {
      log.info('The template is already the latest version')
      return
    }
  }
  const version = versions[0]
  await downloadTemplate(config.template.repository, version, noDeps)
  config = await config.reload({
    templateVersion: version,
    loadTemplate: true,
  })
  checkParams.engine(config)

  await prompt(config)
  await applyTemplate(config)
  await config.template.hooks('afterUpgrade')

  log.info('upgrade complete')
}
