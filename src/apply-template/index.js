const log = require('../utils/log')
const genMilirc = require('./generate-milirc')
const copyFiles = require('./copy-files')
const initFolder = require('./init-folder')
const compileFiles = require('./compile-files')
const checkFiles = require('./check-files')


module.exports = async function(config, options = {}) {
  const { check = false, diff = false, fold = false } = options

  log.info('compile files...')
  const files = await compileFiles(config)

  if (check) {
    await checkFiles(files, diff, fold)
  } else {
    log.info('initial folders...')
    await initFolder(files)

    log.info('copy files...')
    await copyFiles(files)
    await genMilirc(config)
  }
}
