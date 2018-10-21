const fs = require('fs')
const git = require('simple-git/promise')
const { join } = require('path')
const paths = require('./paths')
const { promisify } = require('util')
const throwError = require('./throwError')


const access = promisify(fs.access)


module.exports = async (repository, version) => {
  const templatePath = join(paths.templates, repository)

  try {
    await access(templatePath, fs.constants.F_OK)
    await git(templatePath).pull()
  } catch(err) {
    // BUG: need delete folder
    await git().clone(repository, templatePath)
  }

  const gitT = git(templatePath)
  const tags = await gitT.tags()

  const branchSummary = await gitT.branch()
  const currentBranch = branchSummary.current


  if (version) {
    version = `v${version}`
    if (!tags.all.includes(version)) {
      throwError([
        'No corresponding template version was found',
        'Please confirm that the version number exists in the tags of the template repository.',
        `Expected template version: ${version}`
      ].join('\n'))
    }

    gitT.checkout(version)
  } else if (tags.latest) {
    await gitT.checkout(tags.latest)
  }

  return { templatePath, currentBranch }
}
