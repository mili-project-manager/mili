import { identity, T } from 'ramda'
type QuesstionTypes = 'input' | 'confirm' | 'number' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'editor'
type Validator = (input: string) => boolean | string
type Choice = string | number | boolean | DetailedChoice
type Choices = ((answers: Answers) => Choice[]) | Choice[]
type Filter = <T>(value: T) => T
type When = (answers: Answers) => boolean

interface DetailedChoice {
  name: string
  value: string | number | boolean
  checked?: boolean
  disabled?: boolean
}

export interface QuestionOptions {
  type?: QuesstionTypes
  name: string
  message?: string | Function
  default?: any
  choices?: Choices
  validate?: Validator
  filter?: Filter
  transformer?: Function
  when?: When
  pageSize?: number
  prefix?: string
  suffix?: string
}

export class Question {
  type: QuesstionTypes = 'input'
  name = ''
  message: string | Function = ''
  default: any
  choices: Choices = []
  validate: Validator = T
  filter: Filter = identity
  transformer: Function = identity
  when: When = T
  pageSize = 0
  prefix = ''
  suffix = ''

  constructor(options: QuestionOptions) {
    if (options.type) this.type = options.type
    if (options.name) this.name = options.name
    else throw new TypeError('name should not be empty')
    if (options.message) this.message = options.message
    if (options.default) this.default = options.default
    if (options.choices) this.choices = options.choices
    if (options.validate) this.validate = options.validate
    if (options.filter) this.filter = options.filter
    if (options.transformer) this.transformer = options.transformer
    if (options.when) this.when = options.when
    if (options.pageSize) this.pageSize = options.pageSize
    if (options.prefix) this.prefix = options.prefix
    if (options.suffix) this.suffix = options.suffix
  }

  private includesByChoices(value, answers: Answers): boolean {
    let choices = this.choices
    if (typeof choices === 'function') choices = choices(answers)

    return choices
      .filter(choice => typeof choice !== 'object' || !choice.disabled)
      .some(choice => {
        if (typeof choice === 'object') return choice.value === value
        return choice === value
      })
  }

  public answered(answers: Answers): boolean {
    const { name, type } = this
    if (!Object.keys(answers).includes(name)) return false

    const answer = answers[name]

    if (type === 'input' || type === 'password') return typeof answer === 'string'
    if (type === 'number') return typeof answer === 'number'
    if (type === 'confirm') return typeof answer === 'boolean'
    if (type === 'list' || type === 'rawlist' || type === 'expand') return this.includesByChoices(answer, answers)
    if (type === 'checkbox' && Array.isArray(answer)) return answer.every(value => this.includesByChoices(value, answers))

    return false
  }
}

export type Questions = Question[]

export interface Answers {
  [name: string]: string | number | boolean | (string | number)[]
}

export type Prompter = (question: Question[]) => Promise<Answers>

