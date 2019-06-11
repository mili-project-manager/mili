const { join, isAbsolute } = require('path')
const fs = require('fs-extra')
const glob = require('micromatch')
const check = require('./check')
const log = require('../../utils/log')
const throwError = require('../../utils/throw-error')


const checkRecursive = async(dir, ignore, options, errors) => {
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) return

  if (await fs.pathExists(join(dir, '.milirc.yml'))) {
    log.info(`check ${dir}`)
    try {
      await check({ ...options, cwd: dir })
    } catch (e) {
      errors.push({ dir })
    }
    console.log('\n ')
  }

  let folders = await fs.readdir(dir)
  folders = folders
    .map(filename => join(dir, filename))
    .filter(filepath => !glob.isMatch(filepath, ignore))

  /**
   * NOTE: There should upgrade one by one,
   *       because it's possible that two of these projects were used same template,
   *       resulting in template download conflict.
   */
  for (const folder of folders) {
    await checkRecursive(folder, ignore, options, errors)
  }
}

module.exports = async options => {
  const {
    cwd = process.cwd(),
    ignore = [],
  } = options

  const absolutePathIgnored = ignore.map(item => {
    if (!isAbsolute(item)) return join(cwd, item)
    return item
  })

  const errors = []
  await checkRecursive(cwd, absolutePathIgnored, options, errors)

  if (errors.length) {
    errors.forEach(error => {
      log.error('check', `The ${error.dir} not pass.`)
    })

    throwError('Run `npx mili update` to fix it')
  }
}
