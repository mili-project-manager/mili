const { join } = require('path')
const git = require('simple-git/promise')
const { readJson } = require('./utils')


module.exports = async path => {
  const view = {}

  try {
    const config = await readJson(join(path, 'package.json'))
    view.name = config.name,
    view.version = config.version
    view.description = config.description
    view.repository = config.repository
    view.keywords = config.keywords
    view.author = config.author
  } catch(e) {
    // NOTE: don't care
  }

  if ((!view.repository || !view.repository.url) && await git(path).checkIsRepo()) {
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
