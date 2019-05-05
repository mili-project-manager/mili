const fs = require('fs-extra')
const { join } = require('path')

const templatePath = join(__dirname, '../../templates')

module.exports = async() => {
  await fs.remove(templatePath)
}
