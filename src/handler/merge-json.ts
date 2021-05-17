import * as fs from 'fs-extra'
import { Compile } from '@/interface/handler'
import * as R from 'ramda'
import * as path from 'path'


export const compile: Compile = async function(dist, src, filepath, resource, options) {
  const encoding = options.encoding

  const distfilepath = path.join(dist, filepath)
  const srcfilepath = path.join(src, filepath)
  const jsonInProject = await fs.pathExists(distfilepath) ? await fs.readJSON(distfilepath, { encoding }) : null
  const jsonInTemplate = await fs.readJSON(srcfilepath, { encoding })

  const json = R.mergeDeepRight(jsonInProject, jsonInTemplate)
  await fs.writeJSON(srcfilepath, json)
}
