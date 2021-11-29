import AJV from 'ajv8'
import ajvKeywords from 'ajv-keywords'
import { Handler } from './interface/template'
import { Path } from '@/interface/path'
import * as handlerSchema from './schema/handler.json'


const ajv = new AJV()
ajvKeywords(ajv)
const validate = ajv.compile(handlerSchema)
export async function execHandler(dist: Path, src: Path, filepath: Path, resource: Map<string, any>, handler: Handler): Promise<Path> {
  const pkg = await import(handler.name)

  const valid = validate(pkg)
  if (!valid) throw new Error(ajv.errorsText(validate.errors, { dataVar: 'loader' }))

  // TODO: Check Hanlder engines
  return await pkg.compile(dist, src, filepath, resource, handler.options)
}
