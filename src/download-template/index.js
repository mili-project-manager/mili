const getLocalStoragePath = require('../utils/get-local-storage-path')
const installDeps = require('./install-deps')
const throwError = require('../utils/throw-error')

const copy = require('./copy')
const clone = require('./clone')
const npmInstall = require('./npm-install')


module.exports = async(repository, version, noDeps) => {
  const localStoragePath = getLocalStoragePath(repository, version)

  if (repository.type === 'local') {
    await copy(repository, version, localStoragePath)
  } else if (repository.type === 'git') {
    await clone(repository, version, localStoragePath)
  } else if (repository.type === 'npm') {
    await npmInstall(repository, version, localStoragePath)
  } else {
    throwError([
      'Cannot parse template git repository or local path.',
      'Please check your input is correct and is supported by mili.',
    ].join('\n'))
  }

  if (!noDeps) await installDeps(localStoragePath)
}
