import * as mustache from 'mustache'
import { Handler, FileGenerator, PathGenerator } from '@/internal'

const genFile: FileGenerator = async(file, resource) => {
  const view = {
    mili: resource.mili,
    project: resource.project,
    template: resource.template,
    answers: resource.answers,
    addition: file.addition,
  }

  file.content = mustache.render(file.content, view)
}

const genPath: PathGenerator = async path => path.replace(/.mustache$/, '')

export default new Handler(genFile, genPath)
