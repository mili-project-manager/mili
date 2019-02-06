const { join } = require('path')

module.exports = (path) => join(__dirname, '../templates', encodeURIComponent(path))
