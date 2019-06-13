import test from 'ava'
import isRepository from '../../src/utils/is-repository'
import path from 'path'

test('Is the root dir of repository', async t => {
  const isr = await isRepository(path.resolve(__dirname, '../../'))
  t.true(isr)
})

test('Not the root dir of repository', async t => {
  const isr = await isRepository(path.resolve(__dirname))
  t.false(isr)
})