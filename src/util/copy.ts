import * as fs from 'fs-extra'
import simpleGit from 'simple-git'


export async function copy(src: string, dist: string): Promise<void> {
  const git = simpleGit(src)

  await fs.copy(src, dist, {
    filter: async srcFile => {
      const result = await git.checkIgnore(srcFile)

      return !result.length
    },
  })
}
