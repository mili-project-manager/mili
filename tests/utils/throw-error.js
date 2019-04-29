import test from 'ava'
import throwError from '../../src/utils/throw-error'


test('format throw error function', t => {
  t.throws(() => throwError('error message'))
})