import test from 'ava'
import { join } from 'path'
import isDirectory from '../../src/utils/is-directory'


test('check is directory', async t => {
  t.true(await isDirectory(join(__dirname, '../../src')))
})