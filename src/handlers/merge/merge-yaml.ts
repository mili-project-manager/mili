import yaml from 'js-yaml'
import merge from 'merge-deep'
import { FileGenerator } from '@/internal'


const mergeYaml: FileGenerator = async file => {
  let content = file.content
  let projectContent = await file.getProjectContent()

  try {
    content = yaml.load(file.content)
  } catch (e) {
    throw new Error([
      'The template file and the project file failed to merge due to a json syntax error in the template file.',
      'The project file will be overwritten directly by the template file.',
      `path: ${file.projectPath}`,
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

  const beginMatched = file.content.match(/^\s*/g)
  const beginBlank = beginMatched ? beginMatched[0] : ''

  const endMatched = file.content.match(/\s*$/g)
  const endBlank = endMatched ? endMatched[0] : ''

  const result = yaml.dump(merge(projectContent, content))
    .replace(/\s*$/, '')

  file.content = `${beginBlank}${result}${endBlank}`
}

export default mergeYaml
