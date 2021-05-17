interface Choice {
  name: string
  short: string
  value: string | number
}

export interface Question {
  type: 'input'| 'number'| 'confirm'| 'list'| 'rawlist'| 'expand'| 'checkbox'| 'password'| 'editor'
  name: string
  message?: string
  default?: string | number | boolean | Array<string | number | boolean>
  choices?: (Choice | string | number)[]
  loop?: boolean
  when?: any
  schema?: any
}
