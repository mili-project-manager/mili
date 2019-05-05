const git = require('simple-git/promise')
const semver = require('semver')
const log = require('./utils/log')
const isRepo = require('./utils/is-repository')
const childProcess = require('child_process')
const { promisify } = require('util')

const exec = promisify(childProcess.exec)
const getRepositoryVersions = async repository => {
  const result = await git().listRemote(['--tags', repository.url])
  const arr = result.split('\n')
  const versions = arr
    .filter(item => item.length && !/\^{}$/.test(item))
    .map(item => {
      const [commit, ref] = item.split(/\s+/)
      const number = ref.substring('refs/tags/v'.length)
      return { commit, ref, number }
    })
    .filter(item => semver.valid(item.number))
    .sort((a, b) => semver.rcompare(a.number, b.number))

  if (!versions.length) {
    log.warn([
      'Cannot get template versions, May be caused by the following reasons:',
      `1. repository is not a mili template(${repository.url})`,
      '2. template have not a valid tag to mark the version(e.g. v1.0.0)',
      `3. cannot get versions by command: \`git ls-remote --tags ${
        repository.rul
      }}\``,
    ].join('\n'))
  }

  return versions
}

const getNpmVersion = async repository => {
  const { stdout, stderr } = await exec(`npm view ${repository.name} versions  --json`)
  if (stderr) console.error(stderr)
  return JSON.parse(stdout)
    .reverse()
    .map(number => ({ number }))
}

module.exports = async repository => {
  log.info('check template versions')
  if (repository.type === 'git') {
    return await getRepositoryVersions(repository)
  } else if (repository.type === 'local' && (await isRepo(repository.url))) {
    return await getRepositoryVersions(repository)
  } else if (repository.type === 'npm') {
    return await getNpmVersion(repository)
  } else {
    return []
  }
}
