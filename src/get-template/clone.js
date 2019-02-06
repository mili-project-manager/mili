const fs = require('fs-extra')
const git = require('simple-git/promise')
const log = require('../log')


const repositoryExisted = async (repository, storage) => {
  if (!await fs.pathExists(storage)) return false

  const remotes = await git(storage).getRemotes(true)
  if (remotes.every(remote => remote.refs.fetch !== repository)) return false

  return true
}

module.exports = async (repository, storage) => {
  if (await repositoryExisted(repository, storage)) {
    log.info(`pull template from ${repository}...`)
    try {
      await git(storage).pull()
    } catch (e) {
      log.warn(`cannot pull template. try clone from ${repository}...`)
      await fs.remove(storage)
      await git().clone(repository, storage)
    }
  } else {
    log.info(`clone template from ${repository}...`)
    await fs.remove(storage)
    await git().clone(repository, storage)
  }
}
