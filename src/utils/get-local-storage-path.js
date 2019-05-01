const { join } = require('path')

module.exports = (repository, version) => {
  return join(
    __dirname,
    '../../templates',
    encodeURIComponent(repository.url),
    version ? version.number : 'noversion'
  )
}
