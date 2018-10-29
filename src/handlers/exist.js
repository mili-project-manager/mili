const createHandler = require('./createHandler')
const readTargetFile = require('./readTargetFile')



module.exports = createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) file.content = file.targetFile.content
  return file
})
