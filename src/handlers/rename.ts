import { Handler, FileGenerator, PathGenerator } from '@/internal'
import { parse, format } from 'path'


const genFile: FileGenerator = async() => {}

export default newName => {
  const genPath: PathGenerator = async path => {
    const p = parse(path)
    p.base = newName
    return format(p)
  }

  return new Handler(genFile, genPath)
}
