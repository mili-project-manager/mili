const mustache = require('mustache')
const createHandler = require('./create-handler')

module.exports = createHandler(
  file => ({
    ...file,
    content: mustache.render(file.content, file.view),
  }),
  path => path.replace(/.mustache$/, '')
)
