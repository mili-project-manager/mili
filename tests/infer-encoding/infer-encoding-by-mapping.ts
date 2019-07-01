import test from 'ava'
import { inferEncodingByMapping } from '@/infer-encoding'
import { basename } from 'path'
import { Encoding } from '@/consts'

test('Infer encoding by mapping', t => {
  const inferEncodingMapping = {
    utf8: '.txt$',
    binary: '.jpg$',
    hex: path => basename(path) === 'abc',
  }

  const inferEncoding = inferEncodingByMapping(inferEncodingMapping)

  t.is(inferEncoding('a/b/c.txt'), Encoding.UTF8)
  t.is(inferEncoding('a/b/c.jpg'), Encoding.Binary)
  t.is(inferEncoding('a/b/abc'), Encoding.Hex)
  t.is(inferEncoding('a/b/c.xyz'), Encoding.UTF8)
})

test('Throw error when mapping is unexpect', t => {
  const inferEncodingMapping = {
    utf8: 123,
    binary: '.jpg$',
    hex: path => basename(path) === 'abc',
  }

  t.throws(() => inferEncodingByMapping(inferEncodingMapping as any))
})
