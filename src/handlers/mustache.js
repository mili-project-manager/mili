const mustache = require('mustache')
const createHandler = require('./createHandler')


module.exports = createHandler(
  file => ({
    ...file,
    content: mustache.render(file.content, file.view)
  }),
  path => path.replace(/.mustache$/, '')
)
