import test from 'ava'
import { inferEncodingImmobile } from '@/infer-encoding'
import { Encoding } from '@/consts'

test('Infer encoding immobile', t => {
  const inferEncoding = inferEncodingImmobile(Encoding.UTF8)

  t.is(inferEncoding('/a/b/c'), Encoding.UTF8)
  t.is(inferEncoding('/a/b/c.jpg'), Encoding.UTF8)
  t.is(inferEncoding('/a/b/c.txt'), Encoding.UTF8)
  t.is(inferEncoding('/a/b/'), Encoding.UTF8)
})