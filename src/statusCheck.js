const fs = require('fs-extra')
const git = require('simple-git/promise')
const throwError = require('./throwError')


const isEmpty = async path => {
  const files = await fs.readdir(path)
  if (files.length) return false

  return true
}

const reminder = [
  'This command may cause some files to be overwritten',
  "If you're sure you want to run this command, rerun it with --force.",
].join('\n')
module.exports = async path => {
  if (!(await isEmpty(path))) {
    throwError([
      'The project directory is not a git repository and is a non-empty folder.',
      reminder,
    ].join('\n'))
  } else if (await git(path).checkIsRepo()) {
    throwError([
      'Git working directory not clean',
      reminder,
    ].join('\n'))
  }
}
