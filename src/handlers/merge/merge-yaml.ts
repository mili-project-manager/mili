import yaml from 'js-yaml'
import merge from 'merge-deep'
import { FileGenerator } from '@/internal'


const mergeYaml: FileGenerator = async file => {
  let content = file.content

  const beginMatched = content.match(/^\s*/g)
  const beginBlank = beginMatched ? beginMatched[0] : ''

  const endMatched = content.match(/\s*$/g)
  const endBlank = endMatched ? endMatched[0] : ''
  let result = content

  if (!file.projectFileExisted) {
    try {
      content = yaml.load(file.content)
      result = yaml.dump(content).replace(/\s*$/, '')
    } catch (e) {
      throw new Error([
        'The template file and the project file failed to merge due to a json syntax error in the template file.',
        'The project file will be overwritten directly by the template file.',
        `path: ${file.templatePath}`,
      ].join('\n'))
    }
  } else {
    let projectContent = await file.getProjectContent()

    try {
      content = yaml.load(file.content)
    } catch (e) {
      throw new Error([
        'The template file and the project file failed to merge due to a json syntax error in the template file.',
        'The project file will be overwritten directly by the template file.',
        `path: ${file.templatePath}`,
      ].join('\n'))
    }

    try {
      projectContent = yaml.load(projectContent)
    } catch (e) {
      throw new Error([
        'The template file and the project file failed to merge due to a yaml syntax error in the project file.',
        'The project file will be overwritten directly by the template file.',
        `path: ${file.projectPath}`,
      ].join('\n'))
    }

    result = yaml.dump(merge(projectContent, content))
      .replace(/\s*$/, '')
  }

  file.content = `${beginBlank}${result}${endBlank}`
}

export default mergeYaml
