import semver from 'semver'
import { Compiler } from '@/internal'
import { version } from '@root/package.json'
import { Project } from './project'
import { Template } from './template'
import { logger } from '@/utils'
import { Maybe } from '@/types.js'
import { Answers } from './question.js'


export interface Milirc {
  mili: {
    version: string
  }

  template: {
    repository: string
    version?: string
  }

  answers?: Answers
}

export type MiliOperations = 'init' | 'upgrade' | 'update' | 'check'
export class Resource {
  readonly mili = { version }

  readonly project: Project

  readonly template: Template

  readonly operation: MiliOperations

  constructor(operation: MiliOperations, project: Project, template: Template) {
    if (!template.engines) {
      logger.warn('The template.engines is not set, you need to check the mili version manually.')
    } else if (!semver.satisfies(this.mili.version, template.engines)) {
      throw new Error([
        `The mili version template need is ${template.engines}`,
        `But mili version used is ${this.mili.version}`,
      ].join('\n'))
    }

    this.operation = operation
    this.project = project
    this.template = template
  }

  get answers(): Maybe<Answers> {
    return this.project.answers
  }

  get milirc(): Milirc {
    const { mili, project, template, answers } = this
    let { record } = template.repository
    if (typeof record === 'function') record = record(project.path)

    return {
      mili,
      template: {
        repository: record,
        version: template.repository.version,
      },
      answers,
    }
  }

  public async compile(): Promise<Compiler> {
    return new Compiler(this)
  }
}
