const loadMiliConfig = require('./load-mili-config')
const loadTemplateConfig = require('./load-template-config')
const loadProjectConfig = require('./load-project-config')


const loadConfig = async ({ cwd, projectName, templateRepository, templateVersion }) => {
  const mili = await loadMiliConfig()
  const template = await loadTemplateConfig(templateRepository, templateVersion)
  const project = await loadProjectConfig(cwd, projectName)


  return {
    mili,
    template,
    project,
    reload: (parms = {}) => loadConfig({ cwd, projectName, templateRepository, templateVersion, ...parms }),
  }
}

module.exports = loadConfig
