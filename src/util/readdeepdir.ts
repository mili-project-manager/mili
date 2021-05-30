import * as path from 'path'
import * as fs from 'fs-extra'
import * as R from 'ramda'
import { Syncable } from '@/interface/syncable'


interface Options {
  filter?: (filepath: string) => Syncable<boolean>
}

export async function readdeepdir(dir: string, options: Options = {}): Promise<string[]> {
  const files = await fs.readdir(dir)

  const promises = files.map(async(filename: string) => {
    const filepath = path.join(dir, filename)

    if (options.filter && !(await options.filter(filepath))) return []

    const stat = await fs.lstat(filepath)

    if (stat.isDirectory()) {
      const subfiles = await readdeepdir(filepath, options)
      return subfiles.map(sub => path.join(filename, sub))
    }


    return filename
  })

  return R.unnest(await Promise.all(promises))
}
