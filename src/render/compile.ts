import { Template } from './interface/template'
import * as R from 'ramda'
import * as micromatch from 'micromatch'
import { execHandler } from './exec-handler'
import { readdeepdir } from '@/util/readdeepdir'
import { TEMPLATE_CACHE_FILEPATH } from '@/const'
import { v4 as uuid } from 'uuid'
import * as fs from 'fs-extra'
import * as path from 'path'


export async function compile(cwd: string, templatePath: string, templates: Template[], base: Map<string, any>): Promise<void> {
  const resource = new Map(base)

  const cacheDir = path.join(TEMPLATE_CACHE_FILEPATH, uuid())
  await fs.ensureDir(cacheDir)
  await fs.emptyDir(cacheDir)
  await fs.copy(templatePath, cacheDir)

  for (const filename of await readdeepdir(cacheDir)) {
    for (const template of templates) {
      if (!micromatch.isMatch(filename, template.path, { dot: true })) continue

      let filepath = filename
      const encoding = template.encoding

      for (const handler of template.handlers) {
        const subpath = await execHandler(
          cwd,
          cacheDir,
          filepath,
          resource,
          R.mergeDeepLeft(handler, { options: { encoding } }),
        )

        if (subpath) filepath = subpath

        if (filepath === '/dev/null') break
      }

      break
    }
  }
}
