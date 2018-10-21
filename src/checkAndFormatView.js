const { version } = require('../package.json')



const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/

module.exports = v => {
  const view = { ...v }

  if (view.repository && view.repository.url) {
    const url = view.repository.url
    if (/github.com/.test(url)) {
      view.repository = { ...view.repository, type: 'github' }

      const matched = url.match(gitUrlRegexp)
      if (matched) {
        const [, , , , , , , links] = matched
        const [user, name] = links.split('/').slice(-2)
        view.repository = { ...view.repository, type: 'github', user, name }
      }
    }
  }

  view.mili = { version }

  return view
}
