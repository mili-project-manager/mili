import test from 'ava'
import { join, relative } from 'path'
import formatRepository from '../../src/utils/format-repository'

test('format github repository', t => {
  const result = {
    type: 'git',
    service: 'github',
    owner: 'Val-istar-Guo',
    name: 'mili-template',
    url: 'https://github.com/Val-istar-Guo/mili-template.git',
    path: 'https://github.com/Val-istar-Guo/mili-template.git',
  };

  t.deepEqual(formatRepository('https://github.com/Val-istar-Guo/mili-template.git'), result)
  // t.deepEqual(formatRepository('git@github.com:Val-istar-Guo/mili-template.git'), result)
  t.deepEqual(formatRepository('Val-istar-Guo/mili-template'), result)
  t.deepEqual(formatRepository('github:Val-istar-Guo/mili-template'), result)
  
  // formatRepository('');
  // formatRepository('/User/template/mili-template');
})

test('format npm package', t => {
  t.deepEqual(formatRepository('npm:mili-template'), {
    type: 'npm',
    owner: '',
    name: 'mili-template',
    url: 'npm:mili-template',
    path: 'npm:mili-template',
  })
})

test('format relative path', t => {
  const absolutePath = join(__dirname, '../../src')
  const relativePath = `./${relative(process.cwd(), absolutePath)}`
  const result = formatRepository(relativePath)
  t.deepEqual(result, {
    ...result,
    type: 'local',
    owner: null,
    name: null,
    url: absolutePath,
  })

  t.is(result.path(__dirname), '../../src')
})
