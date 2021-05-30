import * as R from 'ramda'
import Ajv from 'ajv'
import { CompielOptions, Compile } from '@/interface/handler'
import * as evalstr from 'eval'
import { genEvalContent } from '@/util/gen-eval-content'


interface Options extends CompielOptions {
  schema?: any
  eval?: string
}

const ajv = new Ajv()


export const compile: Compile<Options> = function(dist, src, filepath, resource, options) {
  if (('schema' in options)) {
    const validate = ajv.compile(options.schema)
    const valid = validate(R.fromPairs(Array.from(resource.entries())))
    if (valid) return '/dev/null'
  } else if (options.eval) {
    const content = genEvalContent(
      JSON.stringify(R.fromPairs(Array.from(resource.entries()))),
      options.eval,
    )

    if (evalstr(content)) return '/dev/null'
  } else {
    return '/dev/null'
  }
}
