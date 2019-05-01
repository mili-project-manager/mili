const upgradeRecursive = require('./upgrade-recursive')
const upgrade = require('./upgrade')

module.exports = async options => {
  if (options.recursive) {
    await upgradeRecursive(options)
  } else {
    await upgrade(options)
    log.info('upgrade complete')
  }
}
