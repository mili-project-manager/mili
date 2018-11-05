const fs = require('fs-extra')
const { join } = require('path')
const mustache = require('mustache')


module.exports = async (targetPath, view) => {
  const template = await fs.readFile(join(__dirname, 'template.mustache'), 'utf8')
  const milirc = mustache.render(template, view)

  await fs.writeFile(join(targetPath, '.milirc.yml'), milirc, 'utf8')
}
