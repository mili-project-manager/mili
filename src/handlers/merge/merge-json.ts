import merge from 'merge-deep'
import { FileGenerator } from '@/internal'


const mergeJson: FileGenerator = async file => {
  let { content } = file

  const beginMatched = content.match(/^\s*/g)
  const beginBlank = beginMatched ? beginMatched[0] : ''

  const endMatched = content.match(/\s*$/g)
  const endBlank = endMatched ? endMatched[0] : ''
  let result = content

  if (!file.projectFileExisted) {
    try {
      content = JSON.parse(file.content)
      result = JSON.stringify(content, null, '  ')
    } catch (e) {
      throw new Error([
        'The template file and the current file failed to merge due to a json syntax error in the template file.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.templatePath}`,
      ].join('\n'))
    }
  } else {
    let projectContent = await file.getProjectContent()

    try {
      content = JSON.parse(file.content)
    } catch (e) {
      throw new Error([
        'The template file and the current file failed to merge due to a json syntax error in the template file.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.templatePath}`,
      ].join('\n'))
    }

    try {
      projectContent = JSON.parse(projectContent)
    } catch (e) {
      throw new Error([
        'The template file and the current file failed to merge due to a json syntax error in the current file.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.projectPath}`,
      ].join('\n'))
    }

    result = JSON.stringify(merge(projectContent, content), null, '  ')
  }

  file.content = `${beginBlank}${result}${endBlank}`
}

export default mergeJson
