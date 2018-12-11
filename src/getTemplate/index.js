const { isAbsolute } = require('path')
const semver = require('semver')
const git = require('simple-git/promise')


const throwError = require('../throwError')
const log = require('../log')
const { isRepo } = require('../utils')
const installDeps = require('./installDeps')

const copy = require('./copy')
const clone = require('./clone')


const createRevert = (storage, branch) => async () => {
  git(storage).checkout(branch)
}

module.exports = async (path, storage, version) => {
  if (isAbsolute(path)) await copy(path, storage)
  else await clone(path, storage)

  let revert = () => {}

  if (await isRepo(storage)) {
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

    revert = createRevert(storage, currentBranch)
  }

  await installDeps(storage)

  return revert
}
