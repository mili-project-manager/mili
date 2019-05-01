import test from 'ava'
import flatten from '../../src/utils/flatten'

test('flatten the array', t => {
  const arr = [[1, 2], 3, [4, 5]]
  t.deepEqual(flatten(arr), [1, 2, 3, 4, 5])
})
