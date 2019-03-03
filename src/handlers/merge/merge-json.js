const merge = require('merge-deep')


module.exports = file => {
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