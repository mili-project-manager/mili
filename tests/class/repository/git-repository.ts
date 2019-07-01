import test from 'ava'
import { relative } from 'path'
import { GitRepository } from '@/internal'

test('Create git repository', t => {
  const repo = new GitRepository('https://github.com/epoberezkin/ajv.git')

  t.is(repo.owner, 'epoberezkin')
  t.is(repo.name, 'ajv')
  t.is(repo.record, 'https://github.com/epoberezkin/ajv.git')
  t.snapshot(relative(process.cwd(), repo.storage))
})
