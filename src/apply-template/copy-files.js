const fs = require('fs-extra')

module.exports = async files => {
  const promises = files.map(file => fs.writeFile(file.targetPath, file.content, file.encoding))

  await Promise.all(promises)
}
