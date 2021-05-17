import { Compile } from '@/interface/handler'
import * as fs from 'fs-extra'
import * as path from 'path'


export const compile: Compile = async function(dist, src, filepath) {
  await fs.copyFile(
    path.join(src, filepath),
    path.join(dist, filepath),
  )
}
