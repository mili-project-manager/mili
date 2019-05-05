const upgradeRecursive = require('./upgrade-recursive')
const upgrade = require('./upgrade')
const log = require('../../utils/log')

module.exports = async options => {
  if (options.recursive) {
    await upgradeRecursive(options)
  } else {
    await upgrade(options)
    log.info('upgrade complete')
  }
}
