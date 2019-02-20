const loadMilirc = require('./load-milirc')
const loadPackJson = require('./load-package-json.js')
const formatRepository = require('../utils/format-repository')
const isRepo = require('../utils/is-repository')
const git = require('simple-git/promise')



module.exports = async (cwd, projectName) => {
  const packageJson = await loadPackJson(cwd)
  const milirc = await loadMilirc()
  const interaction = milirc.interaction || {}


  const config = {
    path: cwd,

    // shell interaction result
    interaction,
  }

  if (packageJson && packageJson.repository) {
    config.repository = packageJson.repository
  } else if (await isRepo(cwd)) {
    const remotes = await git(cwd).getRemotes(true)

    if (remotes.length) config.repository = formatRepository(remotes[0].refs.push)
  } else {
    config.repository = null
  }

  if (projectName) config.name = projectName
  else if (packageJson && packageJson.name) config.name = packageJson.name
  else config.name = ''

  return config
}
