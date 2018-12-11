const { flatten } = require('../utils')
const throwError = require('../throwError')
const fs = require('fs-extra')
const { join } = require('path')
var glob = require('micromatch');


const genDirList = async (dir, rules) => {
  await fs.access(dir.path, fs.constants.R_OK)
  const dirStats = await fs.stat(dir.path)
  if (!dirStats.isDirectory()) throwError('The template path should be a folder')

  const files = await fs.readdir(dir.path, 'utf8')

  const list = await Promise.all(files.map(async filename => {
    const path = join(dir.path, filename)
    const stats = await fs.stat(path)

    let rule = rules.find(item => {
      if (item.glob) return glob.isMatch(path, item.path)
      return item.path === path
    })
    if (!rule) rule = { ...dir, path }

    if (stats.isDirectory()) return await genDirList(rule, rules)
    else return rule
  }))


  return flatten(list)
}

module.exports = genDirList