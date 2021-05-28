import * as fs from 'fs-extra'
import simpleGit from 'simple-git'
import * as ora from 'ora'
import * as path from 'path'


export async function copy(src: string, dist: string, showProgress = false): Promise<void> {
  const git = simpleGit(src)

  const spinner = ora({
    text: 'Load Files',
    discardStdin: true,
  })

  if (showProgress) spinner.start()

  await fs.copy(src, dist, {
    filter: async srcFile => {
      const relativePath = path.relative(src, srcFile)
      if (showProgress) spinner.text = `Load Files: ${relativePath}`

      const result = await git.checkIgnore(srcFile)

      return !result.length
    },
  })

  if (showProgress) spinner.succeed('Load All Files')
}
