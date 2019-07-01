import { extname, basename } from 'path'
import { FileGenerator, Handler } from '@/internal'
import mergeJson from './merge-json'
import mergeIgnore from './merge-ignore'
import mergeYaml from './merge-yaml'


const jsonFileExts = ['.json']
const yamlFileExts = ['.yaml', '.yml']
const ignoreFilenames = ['.gitignore', '.npmignore']

const notSupportErrorMessage = (filename, projectPath): string => [
  `Merge files of this type(${filename}) are not supported by merge handler.`,
  'Please feedback this question to the template developer.',
  'The current file will be overwritten directly by the template file.',
  `Path: ${projectPath}`,
].join('\n')


const genFile: FileGenerator = async(file, resource) => {
  if (!file.projectFileExisted) return

  const { projectPath } = file

  const ext = extname(projectPath)
  const filename = basename(projectPath)

  if (jsonFileExts.includes(ext)) await mergeJson(file, resource)
  else if (yamlFileExts.includes(ext)) await mergeYaml(file, resource)
  else if (ignoreFilenames.includes(filename)) await mergeIgnore(file, resource)
  else throw new Error(notSupportErrorMessage(filename, projectPath))
}

export default new Handler(genFile)
