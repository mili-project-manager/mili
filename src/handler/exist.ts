import * as fs from 'fs-extra'
import * as path from 'path'
import { Compile } from '@/interface/handler'


export const compile: Compile = async function(dist, src, filepath) {
  const distfilepath = path.join(dist, filepath)

  if (await fs.pathExists(distfilepath)) {
    return '/dev/null'
  }
}

