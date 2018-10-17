const { flatten } = require('./utils')
const throwError = require('./throwError')
const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')


const readdir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)
const access = promisify(fs.access)
const stat = promisify(fs.stat)


const genDirList = async (dir, rules) => {
  await access(dir.path, fs.constants.R_OK)
  const dirStats = await stat(dir.path)
  if (!dirStats.isDirectory()) throwError('The template path should be a folder')

  const files = await readdir(dir.path, 'utf8')

  const list = await Promise.all(files.map(async filename => {
    const path = join(dir.path, filename)
    const stats = await stat(path)

    let rule = rules.find(item => item.path === path)
    if (!rule) rule = { ...dir, path }

    if (stats.isDirectory()) return await genDirList(rule, rules)
    else return rule


      // .then(stats => ({ isDir: stats.isDirectory(), path }))
  }))

  // const list = stats.map(({ isDir, path }) => new Promise{
  //   let rule = rules.find(item => item.path === path)
  //   if (!rule) rule = { ...dir, path }

  //   if (isDir) return genDirList(rule, rules)
  //   else return rule
  // })

  // const list = stats.map(({ isDir, path }) => {
  //   let rule = rules.find(item => item.path === path)
  //   if (!rule) rule = { ...dir, path }

  //   if (isDir) return genDirList(rule, rules)
  //   else return rule
  // })

  return flatten(list)
}

module.exports = genDirList
