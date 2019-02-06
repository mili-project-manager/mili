const throwError = require('./throw-error')
const fs = require('fs-extra')
const { join, isAbsolute } = require('path')

const githubSH = /^(github:)?[-a-zA-Z0-9@:%._\+~#=]+\/[-a-zA-Z0-9@:%._\+~#=]+$/
const cloneLink = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/
const isRelative = path => /^\.\.?\//.test(path)
const isLocalPath = path => join(path) === path


const dirExist = async link => {
  const exist = await fs.pathExists(link)
  if (!exist) return false

  const stats = await fs.stat(link)
  if (stats.isDirectory()) return true

  return false
}

module.exports = (link, cwd) => {
  if (isRelative(link) || isAbsolute(link)) {
    if (isAbsolute(link) && dirExist(link)) return link

    link = join(cwd, link)
    if (dirExist(link)) return link

    throwError('Template path cannot be found. Ensure it is an exist directory.')
  } else if (githubSH.test(link)) {
    return `https://github.com/${link.replace(/^github:/, '')}.git`
  } else if (cloneLink.test(link)) {
    return link
  }

  throwError(`Invalid repository url: ${link}`)
}
