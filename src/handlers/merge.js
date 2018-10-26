const log = require('../log')
const { extname } = require('path')
const createHandler = require('./createHandler')
const readTargetFile = require('./readTargetFile')
const merge = require('merge-deep');


const mergeJson = file => {
  let content = ''
  let targetFileContent = ''

  try {
    content = JSON.parse(file.content)
  } catch (e) {
    log.error('merge', [
      'The template file and the current file failed to merge due to a json syntax error in the template file.',
      'The current file will be overwritten directly by the template file.',
      `path: ${file.targetPath}`,
    ].join('\n'))
    return file
  }

  try {
    targetFileContent = JSON.parse(file.targetFile.content)
  } catch (e) {
    log.error('merge', [
      'The template file and the current file failed to merge due to a json syntax error in the current file.',
      'The current file will be overwritten directly by the template file.'
      `path: ${file.targetPath}`
    ].join('\n'))
    return file
  }

  return {
    ...file,
    content: JSON.stringify(merge(targetFileContent, content), null, '  ')
  }
}

module.exports = createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) {
    if (extname(file.targetPath) === '.json') return mergeJson(file)
    else {
      log.error('merge', [
        `Merge files of this type(${extname(file.targetPath)}) are not supported by mili`,
        'please confirm if the loaded template supports the current mili version,',
        'and feedback this question to the template developer.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.targetPath}`
      ].join('\n'))
    }
  }

  return file
})
