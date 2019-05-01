const log = require('../utils/log')
const genMilirc = require('./generate-milirc')
const copyFiles = require('./copy-files')
const initFolder = require('./init-folder')

module.exports = async config => {
  log.info('initial folders...')
  await initFolder(config.template.files)
  log.info('copy files...')
  await copyFiles(config)
  await genMilirc(config)
}
