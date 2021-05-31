import { Answers } from '@/interface/answers'


export interface Milirc {
  template: string
  version: string
  registry?: string

  answers?: Answers
}
