const { version } = require('../package.json')


module.exports = v => {
  const view = { ...v }

  if (view.repository && view.repository.url) {
    const url = view.repository.url
    if (/github.com/.test(url)) {
      view.repository = { ...view.repository, type: 'github' }

      const matched = url.match(/([-a-zA-Z0-9@:%_\+.~#?&=]+)\/([-a-zA-Z0-9@:%_\+.~#?&=]+)(?=\.git$)/)
      if (matched) {
        const [, user, name] = matched
        view.repository = { ...view.repository, type: 'github', user, name }
      }
    }
  }

  view.mili = { version }

  return view
}
