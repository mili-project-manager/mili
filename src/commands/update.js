const loadConfig = require('../load-config')
const semver = require('semver')
const downloadTemplate = require('../download-template')
const getTemplateVersions = require('../get-template-versions')
const throwError = require('../utils/throw-error')
const applyTemplate = require('../apply-template')
const securityCheck = require('../security-check')
const checkParams = require('../check-params')
const log = require('../utils/log')
const prompt = require('../prompt')

module.exports = async options => {
  const {
    cwd = process.cwd(),
    // whether to skip the security check
    force = false,
    noDeps = false,
  } = options

  // template version expected
  let version = options.version

  if (!force) await securityCheck(process.cwd())
  if (version) checkParams.version(version)

  let config = await loadConfig({ cwd })

  if (version && semver.lt(version, config.template.version.number)) {
    const message = [
      'The version number setted is lower than the current template version.',
      "If you're sure you want to run this command, rerun it with --force.",
    ].join('\n')

    if (force) log.warn(message)
    else throwError(message)
  }

  const versions = await getTemplateVersions(config.template.repository)

  if (versions.length) {
    if (version) {
      version = versions.find(v => v.number === version)
      if (!version) {
        throwError(
          [
            'No corresponding template version was found',
            'Please confirm that the version number exists in the tags of the template repository.',
            `Expected template version: ${version}`,
          ].join('\n')
        )
      }
    } else if (config.template.version) {
      version = versions.find(v => v.number === config.template.version.number)
      if (!version) {
        throwError(
          [
            'No corresponding template version was found',
            'Please confirm that the version number exists in the tags of the template repository.',
            `Expected template version: ${version}(get from .milirc)`,
          ].join('\n')
        )
      }
    } else {
      throwError(
        [
          'Cannot get template version from the .milirc for the project',
          'mili update should specify a version.',
          'and if you want use the latest version, run mili upgrade',
        ].join('\n')
      )
    }
  } else {
    if (version) {
      throwError(
        `The specified version(${version}) does not exist in repository`
      )
    } else if (config.template.version) {
      throwError(
        `The version(${
          config.template.version.number
        }) get from .milirc does not exist in repository`
      )
    } else {
      log.warn(
        [
          'The template repository is not versioned. And will use the default branch/file.',
          'Therefore `mili update` is equivalent to `mili upgrade`',
        ].join('\n')
      )
    }
  }

  await downloadTemplate(config.template.repository, version, noDeps)
  config = await config.reload({
    templateVersion: version,
    loadTemplate: true,
  })
  checkParams.engine(config)

  await prompt(config)
  config.template.files = config.template.files.filter(
    file => file.upgrade !== 'keep'
  )
  await applyTemplate(config)
  await config.template.hooks('afterUpdate')
}
