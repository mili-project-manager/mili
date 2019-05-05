const fs = require('fs-extra')
const { dirname } = require('path')


// OPTIMIZE: Analyze first, then synchronize the files that can be created synchronously.
module.exports = async files => {
  for (const file of files) {
    await fs.ensureDir(dirname(file.targetPath))
  }
}
