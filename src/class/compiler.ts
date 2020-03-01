import { EventEmitter } from 'events'
import { mergeDeepLeft, pick, prop } from 'ramda'
import { join } from 'path'
import { CheckOptions, Resource, Effect } from '@/internal'
import yaml from 'js-yaml'
import { logger } from '@/utils'
import { Template } from './template'
import { Project } from './project'


export interface RenderOptions {
  /**
   * always prompt the question,
   * even though it was answered.
   */
  ignoreAnswered?: boolean
}


export class Compiler {
  readonly resource: Resource

  private readonly eventEmitter: EventEmitter = new EventEmitter()

  constructor(resource: Resource) {
    this.resource = resource

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
    const { template, project } = this
    let { questions } = template
    const namesOfQuestions = questions.map(prop('name'))

    if (project.answers && !force) {
      const answers = project.answers
      questions = questions.filter(question => !question.answered(answers))
    }

    if (!questions.length) return
    logger.info('Please answer the questions of template.')

    let answers = await Effect.prompter(questions)
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
    await Effect.fs.writeFile(join(this.project.path, '.milirc.yml'), milirc, 'utf8')
  }
}
