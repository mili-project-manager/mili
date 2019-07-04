import { Handler, FileGenerator } from '@/internal'


export default (func): Handler => {
  const genFile: FileGenerator = async(file, resource) => {
    file.renderable = !await func(resource)
  }

  return new Handler(genFile)
}
