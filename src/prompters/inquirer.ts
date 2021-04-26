import { Prompter } from '@/internal'
import * as inquirer from 'inquirer'

const inquirerPrompter: Prompter = async questions => await inquirer.prompt(questions)

export default inquirerPrompter
