import { Encoding, InferEncodingFunc } from '@/consts'

export default function(encoding: Encoding): InferEncodingFunc {
  const inferEncoding: InferEncodingFunc = () => encoding
  return inferEncoding
}
