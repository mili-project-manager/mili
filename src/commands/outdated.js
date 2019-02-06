const loadMiliConfig = require('../load-mili-config')
const semver = require('semver')
const log = require('../log')
const throwError = require('../throw-error')
const getTemplateVersions = require('../get-template-versions')


module.exports = async () => {
  const miliConfig = await loadMiliConfig()
  const repository = miliConfig.repository

  const versions = await getTemplateVersions(repository)

  if (semver.valid(miliConfig.version) && semver.lt(miliConfig.version, versions[0].version)) {
    log.warn([
      '',
      '',
      'Project Mili Template Is Outdated',
      'run `npx mili upgrade` to upgrade template',
      '',
      '',
    ].join('\n'))
  }
}
