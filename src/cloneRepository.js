const fs = require('fs-extra')
const git = require('simple-git/promise')
const { join } = require('path')
const paths = require('./paths')
const throwError = require('./throwError')
const semver = require('semver')
const log = require('./log')


const repositoryExisted = async (templatePath, repository) => {
  if (!await fs.pathExists(templatePath)) return false

  const remotes = await git(templatePath).getRemotes(true)
  if (remotes.every(remote => remote.refs.fetch !== repository)) return false

  return true
}

module.exports = async (repository, version) => {
  const templatePath = join(paths.templates, repository)


  if (await repositoryExisted(templatePath, repository)) {
    log.info('pull template...')
    await git(templatePath).pull()
  } else {
    log.info('clone template...')
    await fs.remove(templatePath)
    await git().clone(repository, templatePath)
  }


  const gitT = git(templatePath)
  let tags = await gitT.tags()
  tags = tags.all
    .filter(semver.valid)
    .sort(semver.compare)
    .reverse()

  const branchSummary = await gitT.branch()
  const currentBranch = branchSummary.current

  if (version) {
    version = `v${version}`
    if (!tags.includes(version)) {
      throwError([
        'No corresponding template version was found',
        'Please confirm that the version number exists in the tags of the template repository.',
        `Expected template version: ${version}`
      ].join('\n'))
    }

    await gitT.checkout(version)
    log.info(`template version: ${version}`)
  } else if (tags.length) {
    await gitT.checkout(tags[0])
    log.info(`template version: ${tags[0]}`)
  }

  return { templatePath, currentBranch }
}
