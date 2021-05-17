import { File } from '@/interface/file'
import { Path } from '@/interface/path'
import * as path from 'path'


const binaryFileExtensitions = ['.jpeg', '.jpg', '.png', '.ico', '.webp']

export function inferEncoding(filepath: Path): File['encoding'] {
  const ext = path.extname(filepath)

  if (binaryFileExtensitions.includes(ext)) return 'binary'

  return 'utf8'
}
