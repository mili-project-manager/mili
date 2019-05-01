const createHandler = require('./create-handler')
const readTargetFile = require('./read-target-file')

module.exports = createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) file.content = file.targetFile.content
  return file
})
