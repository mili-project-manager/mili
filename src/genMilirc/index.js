const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const mustache = require('mustache')


const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)


module.exports = async (targetPath, view) => {
  const template = await readFile(join(__dirname, 'template.mustache'), 'utf8')
  const milirc = mustache.render(template, view)

  await writeFile(join(targetPath, '.milirc.yml'), milirc, 'utf8')
}
