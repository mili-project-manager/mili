import { join, isAbsolute } from 'path'
import fs from 'fs-extra'
import glob from 'micromatch'
import logger from './logger'


interface Err {
  readonly dir: string
  readonly message: string
}

const execteFuncInSubproject = async(func: Function, dir: string, options: any, errors: Err[]): Promise<void> => {
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) return

  if (await fs.pathExists(join(dir, '.milirc.yml'))) {
    logger.info(`check ${dir}`)
    try {
      const newOptions = { ...options, cwd: dir }
      await func(newOptions)
    } catch (e) {
      errors.push({ dir, message: e.message })
    } finally {
      console.log('\n')
    }
  }

  let folders = await fs.readdir(dir)
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

export default (func: Function) => async(options: any): Promise<void> => {
  const {
    cwd = process.cwd(),
    ignore = [],
    recursive = false,
  } = options

  if (!recursive) {
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

    if (errors.length) {
      errors.forEach(error => {
        logger.error([
          '',
          `Fail: ${error.dir}.`,
          `Because: ${error.message}`,
          '',
        ].join('\n'))
      })

      throw new Error('Please fix the error.')
    }
  }
}
