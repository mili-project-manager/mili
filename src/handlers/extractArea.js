const createHandler = require('./createHandler')
const readTargetFile = require('./readTargetFile')



module.exports = (name, begin, end = begin) => createHandler(file => {
  file = readTargetFile(file)

  if (file.targetFile.exist) {
    let beginIndex = file.targetFile.content.indexOf(begin)
    beginIndex += begin.length
    const endIndex = file.targetFile.content.indexOf(end, beginIndex)

    if (beginIndex && endIndex) {
      file.view.custom[name] = file.targetFile.content.substring(beginIndex, endIndex)
      console.log(file.view.custom)

    }
  }

  return file
})
