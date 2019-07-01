import test from 'ava'
import { isRelativePath } from '@/utils'


test('check is relative path', t => {
  t.true(isRelativePath('./a/b'))
  t.false(isRelativePath('/User/a'))
  t.false(isRelativePath('http://a.com'))
})