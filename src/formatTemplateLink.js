// github:xx/xx
const throwError = require('./throwError')
const githubSH = /^(github:)?[-a-zA-Z0-9@:%._\+~#=]+\/[-a-zA-Z0-9@:%._\+~#=]+$/
const cloneLink = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/

module.exports = link => {
  if (githubSH.test(link)) {
    return `https://github.com/${link.replace(/^github:/, '')}.git`
  } else if (cloneLink.test(link)) {
    return link
  }

  throwError(`Invalid repository url: ${link}`)
}
