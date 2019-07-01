import test from 'ava'
import { checkWorkDir } from '@/utils'

test('Check work dir', async t => {
  await t.throwsAsync(checkWorkDir('/'))
})