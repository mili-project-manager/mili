const { join } = require('path')

module.exports = (repository, version) => join(__dirname, '../../templates', encodeURIComponent(repository.url), version ? version.number : 'noversion')
