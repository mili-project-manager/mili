const git = require('simple-git/promise')


module.exports = async path => {
  if (!await git(path).checkIsRepo()) return false

  const toplevel = await git(path).revparse(['--show-toplevel'])
  if (toplevel.replace(/\n$/, '') !== path) return false

  return true
}
