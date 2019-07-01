import fs from 'fs-extra'
import EventEmitter from 'events'
import { mergeDeepLeft, pick, prop } from 'ramda'
import { join } from 'path'
import { CheckOptions, Prompter, Resource } from '@/internal'
import { inquirerPrompter } from '@/prompters'
import yaml from 'js-yaml'
import { logger } from '@/utils'
import { Template } from './template'
import { Project } from './project'


export interface CompilerOptions {
  prompter?: Prompter
}

export interface RenderOptions {
  /**
   * always prompt the question,
   * even though it was answered.
   */
  ignoreAnswered?: boolean
}


export class Compiler {
  public readonly resource: Resource

  private readonly eventEmitter: EventEmitter = new EventEmitter()

  private readonly prompter: Prompter = inquirerPrompter

  constructor(resource: Resource, options: CompilerOptions = {}) {
    this.resource = resource
    if (options.prompter) this.prompter = options.prompter

    this.template.hooks.map(hook => hook.appendTo(this.eventEmitter))
  }

  get template(): Template {
    return this.resource.template
  }

  get project(): Project {
    return this.resource.project
  }

  public emit(name: string): void {
    this.eventEmitter.emit(name)
  }

  private async prompt(force = false): Promise<void> {
    const { template, project, prompter } = this
    let { questions } = template

    if (project.answers && !force) {
      const answers = project.answers
      questions = questions.filter(question => !question.answered(answers))
    }

    if (!questions.length) return

    logger.info('Please answer the questions of template.')

    const namesOfQuestions = questions.map(prop('name'))
    let answers = await prompter(questions)

    if (project.answers) answers = mergeDeepLeft(answers, project.answers)


    project.answers = pick(namesOfQuestions, answers)
  }

  public async render(options: RenderOptions = {}): Promise<void> {
    await this.prompt(options.ignoreAnswered)

    await this.template.render(this.resource)
    await this.generateMilirc()

    this.emit('rendered')
  }

  public async check(options: CheckOptions): Promise<void> {
    await this.template.check(this.resource, options)
  }

  private async generateMilirc(): Promise<void> {
    const milirc = yaml.safeDump(this.resource.milirc, { skipInvalid: true })
    await fs.writeFile(join(this.project.path, '.milirc.yml'), milirc, 'utf8')
  }
}
