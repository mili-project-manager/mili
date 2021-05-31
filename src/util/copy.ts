import * as fs from 'fs-extra'
import simpleGit from 'simple-git'
import * as ora from 'ora'
import * as path from 'path'
import { exec } from './exec'


export async function copy(src: string, dist: string, showProgress = false): Promise<void> {
  const git = simpleGit(src)

  const spinner = ora({
    text: 'Load Files',
    discardStdin: true,
  })

  if (showProgress) spinner.start()

  const files = await fs.readdir(src)
  const filepaths: string[] = []
  for (const filepath of files) {
    const srcfilepath = path.join(src, filepath)
    const result = await git.checkIgnore(srcfilepath)

    if (result.length) continue

    const stat = await fs.lstat(srcfilepath)

    if (stat.isDirectory()) filepaths.push(`${filepath}/.`)
    else filepaths.push(filepath)
  }


  const tarOutput = path.relative(src, dist)
  await exec(`tar -cf ${tarOutput}.tar ${filepaths.join(' ')} && tar -xf ${dist}.tar -C ${dist}`, { cwd: src })

  if (showProgress) spinner.succeed('Load All Files')
}
