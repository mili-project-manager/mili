const createHandler = require('./create-handler')
const readTargetFile = require('./read-target-file')



module.exports = (name, begin, end = begin) => createHandler(file => {
  file = readTargetFile(file)

  if (!file.targetFile.exist) return file

  let beginIndex = file.targetFile.content.indexOf(begin)
  if (beginIndex === -1) return file

  beginIndex += begin.length
  const endIndex = file.targetFile.content.indexOf(end, beginIndex)

  if (endIndex === -1) return file

  file.view.custom[name] = file.targetFile.content.substring(beginIndex, endIndex)

  return file
})
