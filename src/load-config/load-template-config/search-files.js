const flatten = require('../../utils/flatten')
const fs = require('fs-extra')
const { join, relative } = require('path')
const glob = require('micromatch')
const isDirectory = require('../../utils/is-directory')
const recommendFileEncoding = require('./recommend-file-encoding')

const searchDirFile = async (dir, rules) => {
  const files = await fs.readdir(dir.path, dir.encoding || 'utf8')

  const list = await Promise.all(
    files.map(async filename => {
      const path = join(dir.path, filename)

      let rule = rules.find(item => {
        if (item.glob) return glob.isMatch(path, item.path)
        return item.path === path
      })
      if (!rule) rule = { ...dir, path }

      if (await isDirectory(path)) return await searchDirFile(rule, rules)
      else
        return {
          ...rule,
          encoding: rule.encoding || recommendFileEncoding(rule.path),
        }
    })
  )

  return flatten(list)
}

module.exports = async config => {
  const files = await searchDirFile(
    { path: config.path, upgrade: 'cover', handlers: [] },
    config.rules
  )
  return files.map(file => ({
    ...file,
    targetPath: file.handlers.reduce(
      (p, handler) => handler.genPath(p),
      relative(config.path, file.path)
    ),
  }))
}
