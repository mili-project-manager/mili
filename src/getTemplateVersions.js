const git = require('simple-git/promise')
const semver = require('semver')



module.exports = async (repository) => {
  const result = await git().listRemote(['--tags', repository])
  const arr = result.split('\n')
  return arr
    .filter(item => item.length && !/\^{}$/.test(item))
    .map(item => {
      const [commit, ref] = item.split(/\s+/)
      const version = ref.substring('refs/tags/v'.length)
      return { commit, ref, version }
    })
    .filter(item => semver.valid(item.version))
    .sort((a, b) => semver.lt(a.version, b.version) ? 1 : -1)
}
