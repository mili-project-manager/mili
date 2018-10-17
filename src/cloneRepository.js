const fs = require('fs')
const git = require('simple-git/promise')
const { join } = require('path')
const paths = require('./paths')
const { promisify } = require('util')


const access = promisify(fs.access)


module.exports = async repository => {
  const templatePath = join(paths.templates, repository)

  try {
    await access(templatePath, fs.constants.F_OK)
    await git(templatePath).pull()
    // pull new commit
  } catch(err) {
    await git().clone(repository, templatePath)
  }

  return templatePath
}
