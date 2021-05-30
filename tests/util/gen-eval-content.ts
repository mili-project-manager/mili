import test from 'ava'
import { genEvalContent } from '@/util/gen-eval-content'
import * as evalstr from 'eval'


test('NPM Template', t => {
  const str = genEvalContent(JSON.stringify({
    answers: {
      test: true,
    },
  }), 'resource.answers.test === true')

  t.true(evalstr(str))
})

