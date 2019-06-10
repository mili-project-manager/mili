const yaml = require('node-yaml')
const merge = require('merge-deep')
const log = require('../../utils/log')


module.exports = file => {
  let content = ''
  let targetFileContent = ''

  try {
    content = yaml.parse(file.content)
  } catch (e) {
    log.error('merge', [
      'The template file and the project file failed to merge due to a json syntax error in the template file.',
      'The project file will be overwritten directly by the template file.',
      `path: ${file.targetPath}`,
    ].join('\n'))
    return file
  }

  try {
    targetFileContent = yaml.parse(file.targetFile.content)
  } catch (e) {
    log.error('merge', [
      'The template file and the project file failed to merge due to a yaml syntax error in the project file.',
      'The project file will be overwritten directly by the template file.',
      `path: ${file.targetPath}`,
    ].join('\n'))
    return file
  }

  return {
    ...file,
    content: yaml.dump(merge(targetFileContent, content)),
  }
}
