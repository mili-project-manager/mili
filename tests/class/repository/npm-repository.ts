import test from 'ava'
import { relative } from 'path'
import { NpmRepository } from '@/internal'

test('Create git repository', t => {
  const repo = new NpmRepository('mili-template')

  t.is(repo.name, 'mili-template')
  t.is(repo.record, 'npm:mili-template')
  t.snapshot(relative(process.cwd(), repo.storage))
})
