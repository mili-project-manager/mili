const { join } = require('path')
const fs = require('fs-extra')
const glob = require('micromatch')
const upgrade = require('./upgrade')
const log = require('../../utils/log')


const upgradeRecursive = async (dir, ignore, options) => {
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) return

  if (await fs.pathExists(join(dir, '.milirc.yml'))) {
    log.info(`upgrading ${dir}`)
    await upgrade({ ...options, cwd: dir })
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
  for (let folder of folders) {
    await upgradeRecursive(folder, ignore, options)
  }
}

module.exports = async options => {
  const {
    cwd = process.cwd(),
    ignore,
  } = options

  await upgradeRecursive(cwd, ignore, options)
}