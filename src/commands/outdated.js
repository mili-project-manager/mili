const semver = require('semver')
const loadConfig = require('../load-config')
const log = require('../utils/log')
const getTemplateVersions = require('../get-template-versions')

module.exports = async (options = {}) => {
  const cwd = options.cwd || process.cwd()
  let config = await loadConfig({ cwd })

  const versions = await getTemplateVersions(config.template.repository)
  const version = config.template.version

  if (!versions.length) {
    throwError(
      [
        'There is no formal versioning of the template repository',
        'mili outdated cannot work',
      ].join('\n')
    )
  }

  if (!version) {
    throwError(
      [
        'Unable to get template version from .milirc',
        'Please check if the .milirc file is configured correctly.',
      ].join('\n')
    )
  }

  if (version && semver.lt(version.number, versions[0].number)) {
    log.warn(
      [
        '',
        '',
        'Project Mili Template Is Outdated',
        'run `npx mili upgrade` to upgrade template',
        '',
        '',
      ].join('\n')
    )
  } else {
    log.info('Congratulations, the current template is the latest version.')
  }
}
