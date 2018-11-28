const { join } = require('path')
const formatHandlers = require('./formatHandlers')
const genTargetPath = require('./genTargetPath')
const recommendFileEncoding = require('./recommendFileEncoding')
const genDirList = require('./genDirList')


module.exports = async (cwd, templateConfig) => {
  let files = await genDirList({ path: templateConfig.path, upgrade: 'cover', handlers: [] }, templateConfig.rules)

  return files
    .map(file => ({
      ...file,
      encoding: file.encoding || recommendFileEncoding(file.path),
    }))
    .map(formatHandlers)
    .map(genTargetPath(templateConfig.path, cwd))
}
