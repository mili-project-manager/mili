import { Answers } from '@/interface/answers'
import { Loader } from './loader'
import { Hook } from './hook'
import { Question } from './question'
import { Template } from './template'


export interface Config {
  /**
   * The template version
   */
  version: string

  /**
   * The range of mili version
   * @example ['>=2.0.0 <3.0.0']
   */
  engines: string[]

  /**
   * Extend from other templates
   *
   * @example ['npm:@mtpl/mili-template']
   */
  extends: {
    template: string
    version: string
    answers?: Answers
    when?: any
  }[]

  /**
   * Load the data need for files rendering
   *
   * @example ['mili-loader-npm']
   */
  loaders: Loader[]

  questions: Question[]
  hooks: Hook[]
  templates: Template[]
}
