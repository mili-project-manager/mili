import test from 'ava'
import { relativePath } from '@/utils'


test('relative path should begin with ./', t => {
  t.is(relativePath('src', './src/a'), './a')
})
