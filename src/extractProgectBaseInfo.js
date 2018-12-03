const { join } = require('path')
const git = require('simple-git/promise')
const { readJson, isRepo } = require('./utils')


const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/

module.exports = async path => {
  const view = {}

  try {
    const config = await readJson(join(path, 'package.json'))
    view.name = config.name,
    view.version = config.version
    view.description = config.description
    view.keywords = config.keywords
    view.author = config.author

    if (typeof config.repository === 'string' && gitUrlRegexp.test(config.repository)) {
      view.repository = { url: config.repository }
    } else if (typeof config.repository === 'object') {
      view.repository = config.repository
    }
  } catch(e) {
    // NOTE: don't care
  }

  if ((!view.repository || !view.repository.url) && await isRepo(path)) {
    const remotes = await git(path).getRemotes(true)
    view.remotes = remotes

    if (remotes.length) {
      if (!view.repository) view.repository = {}
      view.repository.url = remotes[0].refs.push
    }
  }


  // if (!view.name) view.name = '交互'
  // if (!view.version) view.version = '交互'
  // if (!view.description) view.description = '交互'
  // if (!view.repository) view.repository = '交互'
  // if (!view.keywords) view.keywords = '交互'
  // if (!view.author) view.author = '交互'

  return view
}
