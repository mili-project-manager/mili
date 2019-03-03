const fs = require('fs-extra')
const { join } = require('path')
const mustache = require('mustache')


module.exports = async (cwd, config) => {
  const template = await fs.readFile(join(__dirname, 'template.mustache'), 'utf8')
  const milirc = mustache.render(template, config)

  await fs.writeFile(join(cwd, '.milirc.yml'), milirc, 'utf8')
}
