const fs = require('fs-extra')
const { exec } = require('child_process')
const { join } = require('path')
const log = require('../utils/log')


const install = path => new Promise((resolve, reject) => {
  log.info('install template dependencies...')

  exec('npm install --production', { cwd: path }, (error, stdout, stderr) => {
    if (error) {
      log.error('Unable install template dependencies')
      return reject(error)
    }

    // process.stdout.write(stdout)
    process.stderr.write(stderr)
    resolve()
  })
})

module.exports = async path => {
  if (!await fs.pathExists(join(path, 'package.json'))) return
  await install(path)
}

