const fs = require('fs-extra')
const cosmiconfig = require('cosmiconfig')
const semver = require('semver')
const throwError = require('../utils/throw-error')
const { join, relative } = require('path')
const isRelativePath = require('../utils/is-relative-path')

const explorer = cosmiconfig('mili')

const formatVersion1Config = config => ({
  mili: {
    version: config.mili.version,
  },
  template: {
    repository: config.repository,
    version: config.version,
  },
  interaction: '',
  answers: {},
})

module.exports = async cwd => {
  let config = {}
  const filepath = join(cwd, '.milirc.yml')
  if (!(await fs.pathExists(filepath))) return config

  const result = await explorer.load(filepath)
  if (!result) return config

  config = result.config || {}

  if (semver.lt(config.mili.version, '2.0.0')) {
    config = formatVersion1Config(config)
  }

  /**
   * if (!config.template.version) throwError([
   *   'Unable to get template version from .milirc',
   *   'Please check if the .milirc file is configured correctly.',
   * ].join('\n'))
   */

  if (config.template.version && !semver.valid(config.template.version)) {
    throwError([
      'The version number of the template finded in .milirc does not conform to the semver specification',
      'Please check if the .milirc file is configured correctly.',
    ].join('\n'))
  }

  // The relative template path saved in .milirc is relative to the dir of .milirc
  if (isRelativePath(config.template.repository)) {
    config.template.repository = relative(
      process.cwd(),
      join(cwd, config.template.repository)
    )
  }

  return config
}
