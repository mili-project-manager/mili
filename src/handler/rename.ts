import { CompielOptions, Compile } from '@/interface/handler'
import * as fs from 'fs-extra'
import * as path from 'path'


interface Options extends CompielOptions {
  filename: string
}

export const compile: Compile<Options> = async function(dist, src, filepath, resource, options) {
  const srcfilepath = path.join(src, filepath)
  const distfilepath = path.join(path.dirname(srcfilepath), options.filename)

  await fs.move(srcfilepath, distfilepath, { overwrite: true })

  return path.relative(src, distfilepath)
}

