const fs = require('fs-extra')
const { join } = require('path')
const log = require('../utils/log')
const formatRepository = require('../utils/format-repository')

module.exports = async(path, defaulted = null) => {
  let packageJson = defaulted

  try {
    const packageJsonPath = join(path, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      packageJson = await fs.readJson(packageJsonPath)
    } else {
      return packageJson
    }

    if (typeof packageJson.repository === 'string') {
      packageJson.repository = formatRepository(packageJson.repository)
    } else if (
      typeof packageJson.repository === 'object' &&
      packageJson.repository.url
    ) {
      packageJson.repository = formatRepository(packageJson.repository.url)
    }
    return packageJson
  } catch (e) {
    log.warn(`cannot load package.json (${path})`, e.message)
    return packageJson
  }
}
