const cosmiconfig = require('cosmiconfig')
const semver = require('semver')
const throwError = require('../utils/throw-error')


const explorer = cosmiconfig('mili')
module.exports = async () => {
  const result = await explorer.search()
  let config = {}

  if (!result) return config

  config = result.config || {}

  // if (!config.template.version) throwError([
  //   'Unable to get template version from .milirc',
  //   'Please check if the .milirc file is configured correctly.',
  // ].join('\n'))

  if (config.template.version && !semver.valid(config.template.version)) throwError([
    'The version number of the template finded in .milirc does not conform to the semver specification',
    'Please check if the .milirc file is configured correctly.',
  ].join('\n'))

  return config
}
