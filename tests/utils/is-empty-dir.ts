import test from 'ava'
import { join } from 'path'
import { isEmptyDir } from '@/utils'


test('Check is empty dir', async t => {
  t.false(await isEmptyDir(join(__dirname)))
})