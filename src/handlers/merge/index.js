const log = require('../../utils/log')
const { extname, basename } = require('path')
const createHandler = require('../create-handler')
const readTargetFile = require('../read-target-file')
const mergeJson = require('./merge-json')
const mergeIgnore = require('./merge-ignore')
const mergeYaml = require('./merge-yaml')


const jsonFileExts = ['.json']
const yamlFileExts = ['.yaml', '.yml']
const ignoreFilenames = ['.gitignore', '.npmignore']

module.exports = createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) {
    const ext = extname(file.targetPath)
    const filename = basename(file.targetPath)
    if (jsonFileExts.includes(ext)) {
      return mergeJson(file)
    } else if (yamlFileExts.includes(ext)) {
      return mergeYaml(file)
    } else if (ignoreFilenames.includes(filename)) {
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
