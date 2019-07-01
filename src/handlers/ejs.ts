import ejs from 'ejs'
import { Handler, FileGenerator, PathGenerator } from '@/internal'


export default function(options): Handler {
  const genFile: FileGenerator = async(file, resource) => {
    const view = {
      mili: resource.mili,
      project: resource.project,
      template: resource.template,
      answers: resource.answers,
      addition: file.addition,
    }

    file.content = ejs.render(file.content, view, options)
  }

  const genPath: PathGenerator = async path => path.replace(/.ejs$/, '')

  return new Handler(genFile, genPath)
}
