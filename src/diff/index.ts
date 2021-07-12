import { readdeepdir } from '@/util/readdeepdir'
import { showDiff, ShowDiffOptions, showRemoved } from './show-diff'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'
import simpleGit from 'simple-git'
import * as logger from '@/util/logger'
import { exec } from '@/util/exec'


interface DiffOptions extends ShowDiffOptions {
  showDiff: boolean
}

async function diffModified(cwd: string, tmpDir: string, options: DiffOptions): Promise<string[]> {
  const tmpDirGit = simpleGit(tmpDir)
  const filepaths = await readdeepdir(tmpDir, {
    filter: async filepath => {
      const relativePath = path.relative(tmpDir, filepath)
      if (relativePath === '.git') return false
      const result = await tmpDirGit.checkIgnore(filepath)

      return !result.length
    },
  })

  const git = simpleGit(cwd)
  async function isIgnore(filepath: string): Promise<boolean> {
    const result = await git.checkIgnore(filepath)
    return Boolean(result.length)
  }

  const errors: string[] = []

  for (const filepath of filepaths) {
    const srcfilepath = path.join(cwd, filepath)

    const existed = (await fs.pathExists(srcfilepath)) && !(await isIgnore(srcfilepath))


    const oldFilepath = path.join(cwd, filepath)
    const newFilepath = path.join(tmpDir, filepath)

    try {
      await exec(`cmp --silent ${oldFilepath} ${newFilepath}`)
      continue
    } catch (e) {
      if (options.showDiff) {
        const oldBuffer = existed ? await fs.readFile(oldFilepath) : Buffer.from('')
        const newBuffer = await fs.readFile(newFilepath)
        errors.push(showDiff(filepath, oldBuffer, newBuffer, options))
      } else {
        errors.push(chalk.yellow(`${filepath}: Not Match Template`))
      }
    }
  }

  if (errors.length) logger.error(errors.join('\n'))
  return errors
}

async function diffRemoved(cwd: string, tmpDir: string, options: DiffOptions): Promise<string[]> {
  const git = simpleGit(cwd)

  const files = await readdeepdir(cwd, {
    filter: async filepath => {
      const relativePath = path.relative(cwd, filepath)

      if (relativePath === '.git') {
        return false
      }
      const result = await git.checkIgnore(filepath)

      return !result.length
    },
  })

  const errors: string[] = []

  for (const filename of files) {
    const filepath = path.join(tmpDir, filename)
    if (await fs.pathExists(filepath)) return []

    if (options.showDiff) {
      errors.push(showRemoved(filename))
    } else {
      errors.push(chalk.red(`${filepath}: Should be remove`))
    }
  }

  if (errors.length) logger.error(errors.join('\n'))
  return errors
}

export async function diff(cwd: string, tmpDir: string, options: DiffOptions): Promise<string[]> {
  return [
    ...(await diffModified(cwd, tmpDir, options)),
    ...(await diffRemoved(cwd, tmpDir, options)),
  ]
}
