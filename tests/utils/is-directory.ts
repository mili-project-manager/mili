import test from 'ava'
import { join } from 'path'
import { isDirectory } from '@/utils'


test('check is directory', async t => {
  t.true(await isDirectory(join(__dirname, '../../src')))
})
