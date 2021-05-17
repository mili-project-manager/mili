import { Answers } from '@/interface/answers'
import { Question } from './interface/question'
import * as inquirer from 'inquirer'


export async function inquire(questions: Question[], answers: Answers = {}): Promise<Answers> {
  return await inquirer.prompt(questions, answers)
}
