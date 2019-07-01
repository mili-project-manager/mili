import { Prompter } from '@/internal'
import inquirer from 'inquirer'

const inquirerPrompter: Prompter = async questions => await inquirer.prompt(questions)

export default inquirerPrompter
