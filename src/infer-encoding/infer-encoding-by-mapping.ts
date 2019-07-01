import { Encoding, InferEncodingFunc } from '@/consts'
import inferEncodingNormally from './infer-encoding-normally'

type EncodingMapping = Partial<Record<Encoding, string | ((path: string) => boolean)>>

export default function(mapping: EncodingMapping): InferEncodingFunc {
  const encodingRegExpMap = Object.entries(mapping)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        const pattern = new RegExp(value)
        return { encoding: key as Encoding, match: v => pattern.test(v) }
      } else if (typeof value === 'function') {
        return { encoding: key as Encoding, match: v => value(v) }
      }

      throw new Error('Encoding mapping should be function or regexp')
    })

  return path => {
    const item = encodingRegExpMap.find(item => item.match(path))
    if (item && Object.values(Encoding).includes(item.encoding)) return item.encoding
    else return inferEncodingNormally(path)
  }
}
