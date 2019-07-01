// import fse from 'fs-extra'
import { Prompter } from './question'
// import { inquirerPrompter } from '@/prompters'


export interface FileSystem {
  writeFile: Function
  readFile: Function
}

export interface Logger {
  trace(message): void
  debug(message): void
  info(message): void
  warn(message): void
  error(message): void
  fatal(message): void
}

export interface Effects {
  fs?: FileSystem
  prompter?: Prompter
  logger?: Logger
}


/*
 * export class Effect {
 *   public fs: FileSystem = fse
 */

//   public prompter: Prompter = inquirerPrompter

/*
 *   constructor(effects: Effects) {
 *     if (effects.fs) this.fs = effects.fs
 *     if (effects.prompter) this.prompter = effects.prompter
 *   }
 * }
 */
