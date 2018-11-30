const fs = require('fs-extra')
const git = require('simple-git/promise')
const throwError = require('../throwError')
const semver = require('semver')
const log = require('../log')


const createRevert = (storage, branch) => async () => {
  git(storage).checkout(branch)
}

const repositoryExisted = async (repository, storage) => {
  if (!await fs.pathExists(storage)) return false

  const remotes = await git(storage).getRemotes(true)
  if (remotes.every(remote => remote.refs.fetch !== repository)) return false

  return true
}

module.exports = async (repository, version, storage) => {
  if (await repositoryExisted(repository, storage)) {
    log.info(`pull template from ${repository}...`)
    await git(storage).pull()
  } else {
    log.info(`clone template from ${repository}...`)
    await fs.remove(storage)
    await git().clone(repository, storage)
  }

  const gitT = git(storage)
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

  return createRevert(storage, currentBranch)
}
