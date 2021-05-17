import * as fs from 'fs-extra'
import { Compile } from '@/interface/handler'
import * as R from 'ramda'
import * as path from 'path'
import * as yaml from 'js-yaml'


export const compile: Compile = async function(dist, src, filepath, resource, options) {
  const encoding = options.encoding

  const distfilepath = path.join(dist, filepath)
  const srcfilepath = path.join(src, filepath)
  const yamlInProject = await fs.pathExists(distfilepath) ? yaml.load(await fs.readFile(distfilepath, { encoding })) : null
  const yamlInTemplate = yaml.load(await fs.readFile(srcfilepath, { encoding }))

  let json = yamlInTemplate

  if (typeof yamlInTemplate === 'object' && yamlInTemplate && typeof yamlInProject === 'object' && yamlInProject) {
    json = R.mergeDeepLeft(yamlInTemplate, yamlInProject)
  }


  await fs.writeFile(srcfilepath, yaml.dump(json))
}

