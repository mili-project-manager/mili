const ejs = require('ejs')
const createHandler = require('./create-handler')

module.exports = options =>
  createHandler(
    file => ({
      ...file,
      content: ejs.render(file.content, file.view, options),
    }),
    path => path.replace(/.ejs$/, '')
  )
