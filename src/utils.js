const fs = require('fs')
const { promisify } = require('util')
const git = require('simple-git/promise')


const readFile = promisify(fs.readFile)
const access = promisify(fs.access)

exports.readJson = path => access(path, fs.constants.R_OK)
  .then(() => readFile(path))
  .then(content => JSON.parse(content))

exports.flatten = arr => arr.reduce((result, item) => {
  if (Array.isArray(item)) {
    return result.concat(item)
  }
  else return [...result, item]
}, [])

exports.isRepo = async path => {
  if (!await git(path).checkIsRepo()) return false
  const toplevel = await git(path).revparse(['--show-toplevel'])
  if (toplevel.replace(/\n$/, '') !== path) return false

  return true
}
