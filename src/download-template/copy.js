const fs = require('fs-extra')
const git = require('simple-git/promise')
const log = require('../utils/log')
const isRepo = require('../utils/is-repository')


module.exports = async (repository, version, storage) => {
  await fs.emptyDir(storage)
  log.info(`copy template from ${repository.url}`)
  await fs.copy(repository.url, storage)

  if (isRepo(storage)) {
    if (version) {
      await git(storage).reset('hard')
      await git(storage).checkout(`v${version.number}`)
      log.info(`template version: ${version.number}`)
    } else {
      log.warn('template repository is not versioned, use the default branch')
    }
  } else {
    log.warn('template repository is not versioned, use the default files')
  }
}
