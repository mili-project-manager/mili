import { extname } from 'path'
import { Encoding, InferEncodingFunc } from '@/consts'


const binaryFileExtensitions = ['.jpeg', '.jpg', '.png', '.ico']
const inferFileEncoding: InferEncodingFunc = path => {
  if (binaryFileExtensitions.includes(extname(path))) return Encoding.Binary

  return Encoding.UTF8
}

export default inferFileEncoding
