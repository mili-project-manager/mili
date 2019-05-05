const fs = require('fs-extra')


module.exports = async path => {
  await fs.access(path, fs.constants.R_OK)
  const stats = await fs.stat(path)
  return stats.isDirectory()
}
