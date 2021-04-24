import { join, isAbsolute, dirname, resolve } from 'path'
import * as glob from 'micromatch'
import { Effect } from '@/internal'
import { uniq, union } from 'ramda'
import isChildPathOf from './is-child-path-of'


interface Err {
  readonly dir: string
  readonly message: string
}


type ExectableFunc = (options: any) => Promise<void> | void

const execteFuncInSubproject = async(func: ExectableFunc, dir: string, options: any, errors: Err[]): Promise<void> => {
  const stats = await Effect.fs.stat(dir)
  if (!stats.isDirectory()) return

  if (await Effect.fs.pathExists(join(dir, '.milirc.yml'))) {
    Effect.logger.info(`Find project ${dir}`)
    try {
      const newOptions = { ...options, cwd: dir }
      await func(newOptions)
    } catch (e) {
      errors.push({ dir, message: e.message })
    } finally {
      console.log('\n')
    }
  }

  let folders = await Effect.fs.readdir(dir)
  folders = folders
    .map(filename => join(dir, filename))
    .filter(filepath => !glob.isMatch(filepath, options.ignore))

  /**
   * NOTE: There should upgrade one by one,
   *       because it's possible that two of these projects were used same template,
   *       resulting in template download conflict.
   */
  for (const folder of folders) {
    await execteFuncInSubproject(func, folder, options, errors)
  }
}

function dirOfFiles(files: string[], root = '/'): string[] {
  if (!files.length) return []

  const dirs = files
    .map(filepath => dirname(filepath))
    .filter(filepath => filepath !== root)

  const uniqDirs = uniq(dirs)
  const parentDirs = dirOfFiles(uniqDirs, root)

  return union(parentDirs, dirs)
}

/**
 * Check the dir of files that include .milirc.
 * It is useful for lint-stage.
 */
const execteFuncInParentProject = async(func: ExectableFunc, files: string[], options: any, errors: Err[]): Promise<void> => {
  const baseUrl = options.cwd ? resolve(options.cwd) : process.cwd()
  const dirs = dirOfFiles(files)
    .filter(isChildPathOf(baseUrl, true))

  for (const dir of dirs) {
    if (await Effect.fs.pathExists(join(dir, '.milirc.yml'))) {
      Effect.logger.info(`Find project ${dir}`)
      try {
        const newOptions = { ...options, cwd: dir }
        await func(newOptions)
      } catch (e) {
        errors.push({ dir, message: e.message })
      } finally {
        console.log('\n')
      }
    }
  }
}

const handleErrors = (errors: Err[]): void => {
  if (errors.length) {
    errors.forEach(error => {
      Effect.logger.error([
        '',
        `Fail: ${error.dir}.`,
        `Because: ${error.message}`,
        '',
      ].join('\n'))
    })

    throw new Error('Please fix the error.')
  }
}

export default (func: (options) => void) => async(options: any): Promise<void> => {
  const {
    cwd = process.cwd(),
    ignore = [],
    recursive = false,
    files = [],
  } = options

  if (files.length) {
    const absoluteFiles = files.map((item: string) => {
      if (!isAbsolute(item)) return join(cwd, item)
      return item
    })

    const errors: Err[] = []
    await execteFuncInParentProject(func, absoluteFiles, options, errors)
    handleErrors(errors)
  } else if (!recursive) {
    await func(options)
  } else {
    const absolutePathIgnored = ignore.map((item: string) => {
      if (!isAbsolute(item)) return join(cwd, item)
      return item
    })

    const newOptions = {
      ...options,
      ignore: absolutePathIgnored,
    }
    const errors: Err[] = []
    await execteFuncInSubproject(func, cwd, newOptions, errors)
    handleErrors(errors)
  }
}
