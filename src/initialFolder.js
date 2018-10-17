const fs = require('fs')
const log = require('./log')
const { promisify } = require('util')
const { dirname } = require('path')


const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)

const ensureDirectoryExistence = async (filePath) => {
  const dir = dirname(filePath);
  try {
    await access(dir, fs.constants.F_OK)
  } catch(e) {
    await ensureDirectoryExistence(dir);
    await mkdir(dir);
  }
}

// OPTIMIZE: Analyze first, then synchronize the files that can be created synchronously.
module.exports = async files => {
  for(file of files) {
    await ensureDirectoryExistence(file.targetPath)
  }
}
