import relativePath from '../../src/utils/relative-path'
import test from 'ava'


test('relative path should begin with ./', t => {
  t.is(relativePath('src', './src/a'), './a')
})
