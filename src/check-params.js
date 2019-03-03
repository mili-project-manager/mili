const semver = require('semver')


module.exports = {
  version: version => {
    if (!semver.valid(version)) {
      throwError([
        'Version number is wrong',
        'Make sure the version number conforms to the semver specification',
        'Semantic Versioning: https://semver.org',
      ].join('\n'))
    }
  }
}
