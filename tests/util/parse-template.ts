import test from 'ava'
import { parseTemplate } from '@/util/parse-template'

test('NPM Template', t => {
  const repository = parseTemplate('npm:@mtpl/code-style', 'latest')

  t.is(repository.name, '@mtpl/code-style')
})

test('Git Http Template', t => {
  const repository = parseTemplate('https://github.com/mili-project-manager/mili.git', 'latest')

  t.is(repository.name, 'https://github.com/mili-project-manager/mili.git')
})


test('Git SSH Template', t => {
  const repository = parseTemplate('git@github.com:mili-project-manager/mili.git', 'latest')

  t.is(repository.name, 'git@github.com:mili-project-manager/mili.git')
})
