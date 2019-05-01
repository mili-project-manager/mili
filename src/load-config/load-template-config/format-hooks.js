const { exec } = require('child_process')
const log = require('../../utils/log')

module.exports = hooks => name =>
  new Promise((resolve, reject) => {
    if (typeof hooks[name] !== 'string') return resolve()
    log.info(`run ${name} hook...`)

    exec(hooks[name], (error, stdout, stderr) => {
      if (error) {
        log.error('hook exec error', error)
        return resolve()
      }

      process.stdout.write(stdout)
      process.stderr.write(stderr)

      resolve()
    })
  })
