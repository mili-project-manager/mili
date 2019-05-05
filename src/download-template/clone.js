const fs = require('fs-extra')
const git = require('simple-git/promise')
const log = require('../utils/log')

const repositoryExisted = async storage => await fs.pathExists(storage)

module.exports = async(repository, version, storage) => {
  if (version && !(await repositoryExisted(storage))) {
    log.info(`clone template from ${repository.url}...`)
    await fs.remove(storage)

    await git().clone(repository.url, storage, [
      '--branch',
      `v${version.number}`,
      '--single-branch',
    ])
    log.info(`template version: ${version.number}`)
  } else if (!version) {
    log.warn('template repository is not versioned, use the default branch')
    await fs.remove(storage)
    await git().clone(repository.url, storage)
  } else {
    log.info('use the cache of repository')
  }
}
