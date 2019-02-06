const { join } = require('path')
const formatHandlers = require('./format-handlers')
const genTargetPath = require('./gen-target-path')
const recommendFileEncoding = require('./recommend-file-encoding')
const genDirList = require('./gen-dir-list')


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
