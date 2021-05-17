import AJV from 'ajv'
import ajvKeywords from 'ajv-keywords'
import { Loader } from '@/render/interface/loader'
import * as loaderSchema from './schema/loader.json'


const ajv = new AJV()
ajvKeywords(ajv)
const validate = ajv.compile(loaderSchema)
export async function execLoader(cwd: string, loader: Loader): Promise<Record<string, any>> {
  const pkg = await import(loader.name)

  const valid = validate(pkg)
  if (!valid) throw new Error(ajv.errorsText(validate.errors, { dataVar: 'loader' }))

  return pkg.exec(cwd, loader.options)
}
