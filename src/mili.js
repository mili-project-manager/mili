const init = require('./commands/init')
const upgrade = require('./commands/upgrade')
const update = require('./commands/update')
const clean = require('./commands/clean')
const outdated = require('./commands/outdated')

module.exports = {
  init,
  upgrade,
  update,
  clean,
  outdated,
}
