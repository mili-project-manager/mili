const fs = require('fs-extra')
const log = require('../log')


module.exports = async (path, storage) => {
  await fs.emptyDir(storage)
  log.info(`copy template from ${path}`)
  await fs.copy(path, storage)
}
