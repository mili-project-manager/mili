const createHandler = require('./create-handler')

module.exports = func => createHandler(file => ({ ...file, render: func(file.view, file) }))
