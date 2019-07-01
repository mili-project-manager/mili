import test from 'ava'
import { validateGitRepoUrl } from '@/utils'

test('Validate git repository url', t => {
  t.true(validateGitRepoUrl('https://github.com/Val-istar-Guo/mili.git'))
  t.true(validateGitRepoUrl('git@github.com:Val-istar-Guo/mili.git'))
})