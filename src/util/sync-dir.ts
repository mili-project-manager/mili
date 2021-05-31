import * as fs from 'fs-extra'
import * as path from 'path'
import { readdeepdir } from './readdeepdir'
import simpleGit from 'simple-git'


/**
 * Copy file from `src` to `dist`
 * Delete file in `dist` which `src` not existed
 */
export async function syncDir(src: string, dist: string): Promise<void> {
  await fs.copy(src, dist, {
    filter: async filepath => {
      const relativePath = path.relative(src, filepath)
      if (relativePath === '.git') return false
      return true
    },
  })
  const git = simpleGit(dist)

  const files = await readdeepdir(dist, {
    filter: async filepath => {
      const relativePath = path.relative(dist, filepath)
      if (relativePath === '.git') return false
      const result = await git.checkIgnore(filepath)

      return !result.length
    },
  })
  const promises = files.map(async filename => {
    const filepath = path.join(src, filename)
    if (await fs.pathExists(filepath)) return
    await fs.remove(path.join(dist, filename))
  })

  await Promise.all(promises)
}
