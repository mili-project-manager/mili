import test from 'ava'
import { dirExist } from '@/utils'
import { join } from 'path'


test('Check directory existed', async t => {
  t.true(await dirExist(__dirname))
  t.false(await dirExist('./a/b/c'))
  t.false(await dirExist(join(__dirname, './a/b/c')))
})