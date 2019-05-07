const { join } = require('path')
const loadMiliConfig = require('./load-mili-config')
const loadTemplateConfig = require('./load-template-config')
const loadProjectConfig = require('./load-project-config')
const loadMilirc = require('./load-milirc')


const loadConfig = async arg => {
  const { operation, cwd, projectName, loadTemplate } = arg
  let { templateRepository, templateVersion } = arg

  const milirc = await loadMilirc(cwd)

  if (!templateRepository) {
    if (milirc.template && milirc.template.repository) templateRepository = milirc.template.repository
    else throw new Error('Unable to find template repository, please check whether milirc is configured correctly')
  }

  if (!templateVersion && milirc.template && milirc.template.version) {
    templateVersion = {
      number: milirc.template.version,
    }
  }

  const mili = await loadMiliConfig()
  const template = await loadTemplateConfig(templateRepository, templateVersion, loadTemplate)
  const project = await loadProjectConfig(cwd, projectName)

  // NOTE: generate the path that relative to the output folder
  if (typeof template.repository.path === 'function') template.repository.path = template.repository.path(cwd)

  // NOTE: The files of template's targetPath should point to project
  template.files = template.files.map(file => ({
    ...file,
    targetPath: join(project.path, file.targetPath),
  }))

  return {
    operation,
    mili,
    template,
    project,
    reload: (parms = {}) => loadConfig({ ...arg, ...parms }),
  }
}

module.exports = loadConfig
