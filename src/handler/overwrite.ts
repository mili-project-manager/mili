import { Compile } from '@/interface/handler'
import * as fs from 'fs-extra'
import * as path from 'path'


export const compile: Compile = async function(dist, src, filepath) {
  const distfilepath = path.join(dist, filepath)
  const srcfilepath = path.join(src, filepath)

  await fs.ensureDir(path.dirname(distfilepath))
  await fs.copyFile(srcfilepath, distfilepath)
}
