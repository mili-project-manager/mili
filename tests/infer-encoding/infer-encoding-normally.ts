import test from 'ava'
import { inferEncodingNormally } from '@/infer-encoding'
import { Encoding } from '@/consts'

test('The normally infer encoding', t => {
  t.is(inferEncodingNormally('/asdf/asdf'), Encoding.UTF8)
  t.is(inferEncodingNormally('/asdf/asdf.jpg'), Encoding.Binary)
  t.is(inferEncodingNormally('asdf/asdf.jpeg'), Encoding.Binary)
  t.is(inferEncodingNormally('/asdf/asdf.png'), Encoding.Binary)
  t.is(inferEncodingNormally('/asdf/asdf.ico'), Encoding.Binary)
})