import * as R from 'ramda'
import Ajv from 'ajv'
import { CompielOptions, Compile } from '@/interface/handler'


interface Options extends CompielOptions {
  schema?: any
}

const ajv = new Ajv()


export const compile: Compile<Options> = function(dist, src, filepath, resource, options) {
  if (('schema' in options)) {
    const validate = ajv.compile(options.schema)
    const valid = validate(R.fromPairs(Array.from(resource.entries())))
    if (valid) return '/dev/null'
  } else {
    return '/dev/null'
  }
}
