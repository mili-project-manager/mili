const fs = require('fs-extra')
const { join } = require('path')
const childProcess = require('child_process')
const { promisify } = require('util')
const log = require('../utils/log')



const genIndexFile = name => `
const { join } = require('path')
const config = require('${name}')
config.path = join('./node_modules/${name}', config.path)

module.exports = config
`

const exec = promisify(childProcess.exec)
module.exports = async (repository, version, storage) => {
  await fs.emptyDir(storage)
  log.info(`install ${repository.name} template from npm...`)

  await fs.writeJSON(join(storage, 'package.json'), {
    main: 'index.js',
    description: '',
    license: 'MIT',
  })
  await fs.writeFile(join(storage, 'index.js'), genIndexFile(repository.name))
  await fs.writeFile(join(storage, '.npmrc'), 'package-lock=false')

  const command = `npm install ${repository.name}@${version.number}`
  await exec(command, { cwd: storage })
}
