import { showDiff, ShowDiffOptions, showRemoved } from './show-diff'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'
import simpleGit from 'simple-git'
import * as logger from '@/util/logger'
import { compare, Difference } from 'dir-compare'


interface DiffOptions extends ShowDiffOptions {
  showDiff: boolean
}


async function dircmp(cwd: string, tmpDir: string): Promise<Difference[]> {
  const git = simpleGit(cwd)

  const result = await compare(cwd, tmpDir, {
    compareContent: true,
    skipSymlinks: true,
    skipSubdirs: true,
    excludeFilter: '.git',
  })

  const diff: Difference[] = []

  for (const item of result.diffSet || []) {
    if (item.state === 'equal' && item.type1 !== 'directory' && item.type2 !== 'directory') continue
    if (item.state !== 'equal' && item.path1 && item.name1) {
      const list = await git.checkIgnore(path.join(item.path1, item.name1))
      if (list.length) continue
    }

    if (item.type1 === 'directory' && item.type2 === 'directory') {
      if (item.path1 && item.name1 && item.path2 && item.name2) {
        const subdiff = await dircmp(path.join(item.path1, item.name1), path.join(item.path2, item.name2))

        diff.push(...subdiff)
      }
      continue
    }

    diff.push(item)
  }

  return diff
}

export async function diff(cwd: string, tmpDir: string, options: DiffOptions): Promise<string[]> {
  const errors: string[] = []
  const diff = await dircmp(cwd, tmpDir)

  for (const item of diff) {
    if (item.type2 === 'missing') {
      if (options.showDiff && item.name1) {
        errors.push(showRemoved(item.name1))
      } else {
        const filepath = path.relative(cwd, path.join(item.path1 || '', item.name1 || ''))
        errors.push(chalk.red(`${filepath}: Should be remove`))
      }
    } else {
      const oldFilepath = path.join(item.path1 || '', item.name1 || '')
      const newFilepath = path.join(item.path2 || '', item.name2 || '')

      const oldBuffer = item.type1 === 'missing' ? Buffer.from('') : await fs.readFile(oldFilepath)
      const newBuffer = await fs.readFile(newFilepath)

      const filepath = path.relative(tmpDir, newFilepath)
      if (showDiff) {
        errors.push(showDiff(filepath, oldBuffer, newBuffer, options))
      } else {
        errors.push(chalk.yellow(`${filepath}: Not Match Template`))
      }
    }
  }

  if (errors.length) logger.error(errors.join('\n'))

  return errors
}
