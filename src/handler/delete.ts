import * as R from 'ramda'
import Ajv from 'ajv'
import { CompielOptions, Compile } from '@/interface/handler'
import * as fs from 'fs-extra'
import * as path from 'path'


interface Options extends CompielOptions {
  schema?: any
}

const del: Compile = async function(dist, src, filepath) {
  const distfilepath = path.join(dist, filepath)
  await fs.remove(distfilepath)
  return '/dev/null'
}

const ajv = new Ajv()

export const compile: Compile<Options> = async function(dist, src, filepath, resource, options) {
  if (('schema' in options)) {
    const validate = ajv.compile(options.schema)
    const valid = validate(R.fromPairs(Array.from(resource.entries())))
    if (valid) return del(dist, src, filepath, resource, options)
  } else {
    return del(dist, src, filepath, resource, options)
  }
}
