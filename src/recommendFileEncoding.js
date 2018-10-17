const { extname } = require('path')


const binaryFileExtensitions = ['.jpg', '.png', '.ico']

module.exports = path => {
  if (binaryFileExtensitions.includes(extname(path))) return 'buffer'
  return 'utf8'
}
