const upgradeRecursive = require('./check-recursive')
const upgrade = require('./check')
const log = require('../../utils/log')


module.exports = async options => {
  if (options.recursive) {
    await upgradeRecursive(options)
    log.info('all check completed')
  } else {
    await upgrade(options)
  }
}
