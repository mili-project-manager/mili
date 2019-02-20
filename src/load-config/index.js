const loadMiliConfig = require('./load-mili-config')
const loadTemplateConfig = require('./load-template-config')
const loadProjectConfig = require('./load-project-config')


const loadConfig = async ({ cwd, projectName, defaultProjectName = '', templateRepository, templateVersion }) => {
  const mili = await loadMiliConfig()
  const project = await loadProjectConfig(cwd, projectName, defaultProjectName)
  const template = await loadTemplateConfig(templateRepository, templateVersion)


  return {
    mili,
    template,
    project,
    reload: (parms = {}) => loadConfig({ cwd, projectName, templateRepository, templateVersion, ...parms }),
  }
}

module.exports = loadConfig
