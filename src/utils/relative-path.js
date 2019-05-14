const { relative } = require('path')

module.exports = (root, path) => `./${relative(root, path)}`
