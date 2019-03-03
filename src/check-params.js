const semver = require('semver')
const throwError = require('./utils/throw-error')


module.exports = {
  version: version => {
    if (!semver.valid(version)) {
      throwError([
        'Version number is wrong',
        'Make sure the version number conforms to the semver specification',
        'Semantic Versioning: https://semver.org',
      ].join('\n'))
    }
  },
  engine: config => {
    if (!semver.satisfies(config.mili.version, config.template.engines)) {
      throwError([
        `The mili version template need is ${config.template.engines}`,
        `But mili version used is ${config.mili.version}`
      ].join('\n'))
    }
  }
}
