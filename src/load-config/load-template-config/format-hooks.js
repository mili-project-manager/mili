const { exec } = require('child_process')
const log = require('../../utils/log')


const execCommand = command => new Promise(resolve => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      log.error('hook exec error', error)
      return resolve()
    }

    process.stdout.write(stdout)
    process.stderr.write(stderr)

    resolve()
  })
})

const execFunction = async func => {
  try {
    await func()
  } catch (error) {
    log.error('hook exec error', error)
  }
}

module.exports = hooks => async name => {
  switch (typeof hooks[name]) {
  case 'string':
    log.info(`run ${name} hook...`)
    await execCommand(hooks[name])
    break
  case 'function':
    log.info(`run ${name} hook...`)
    await execFunction(hooks[name])
    break
  }
}
