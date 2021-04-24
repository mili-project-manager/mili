import test from 'ava'
import { isRootDirOfRepo } from '@/utils'
import * as path from 'path'

test('Is the root dir of repository', async t => {
  const isr = await isRootDirOfRepo(path.resolve(__dirname, '../../'))
  t.true(isr)
})

test('Not the root dir of repository', async t => {
  const isr = await isRootDirOfRepo(path.resolve(__dirname))
  t.false(isr)
})
