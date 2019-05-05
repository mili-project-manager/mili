const inquirer = require('inquirer')

module.exports = async(config, force = false) => {
  const questions = [...config.template.interaction]

  if (!Array.isArray(questions)) return []

  if (
    !force &&
    config.template.interactionSHA1 === config.project.interactionSHA1
  ) {
    config.project.interaction = Object.entries(config.project.answers).map(item => ({ key: item[0], value: item[1] }))
    return []
  }

  questions.map(question => {
    const value = config.project.answers[question.name]
    if (!question.default && value) question.default = value
  })

  const answers = await inquirer.prompt(questions)
  config.project.answers = answers
  config.project.interaction = Object.entries(answers).map(item => ({
    key: item[0],
    value: item[1],
  }))
  return answers
}
