const log = require('../../utils/log')
const { extname, basename } = require('path')
const createHandler = require('../create-handler')
const readTargetFile = require('../read-target-file')
const mergeJson = require('./merge-json')
const mergeIgnore = require('./merge-ignore')
const mergeYaml = require('./merge-yaml')


module.exports = createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) {
    if (extname(file.targetPath) === '.json') {
      return mergeJson(file)
    } else if (['.yaml', '.yml'].includes(extname(file.targetPath))) {
      return mergeYaml(file)
    } else if (['.gitignore', '.npmignore'].includes(basename(file.targetPath))) {
      return mergeIgnore(file)
    } else {
      log.error('merge', [
        `Merge files of this type(${extname(file.targetPath)}) are not supported by mili`,
        'please confirm if the loaded template supports the current mili version,',
        'and feedback this question to the template developer.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.targetPath}`,
      ].join('\n'))
    }
  }

  return file
})
