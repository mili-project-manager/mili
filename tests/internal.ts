import test from 'ava'
import * as internal from '@/internal'
import * as classes from '@/class'
import * as types from '@/types'
import * as handlers from '@/handlers'

test('internal includes all', t => {
  t.true(Object.keys(classes).every(key => key in internal))
  t.true(Object.keys(handlers).every(key => key in internal.buildInHandlers))
  t.deepEqual(internal.buildInHandlers, handlers)
  t.true(Object.keys(types).every(key => key in internal))
})
