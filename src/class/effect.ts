import fse, { WriteFileOptions, CopyOptions, EnsureOptions, ReadOptions, Stats, WriteOptions } from 'fs-extra'
import { Prompter } from './question'
import { inquirerPrompter } from '@/prompters'
import { logger } from '@/utils'


export interface FileSystem {
  writeFile: (file: string, data: any, options?: WriteFileOptions | string) => Promise<void>
  readFile: (file: string, encoding: string) => Promise<string>
  pathExists: (path: string) => Promise<boolean>
  remove: (dir: string) => Promise<void>
  emptyDir: (path: string) => Promise<void>
  copy: (src: string, dest: string, options?: CopyOptions) => Promise<void>
  ensureDir: (path: string, options?: EnsureOptions | number) => Promise<void>
  readJSON: (file: string, options?: ReadOptions) => Promise<any>
  writeJSON: (file: string, object: any, options?: WriteOptions) => Promise<void>
  stat: (path: string | Buffer) => Promise<Stats>
  readdir: (path: string | Buffer) => Promise<string[]>
}

export interface Logger {
  trace(message): void
  debug(message): void
  info(message): void
  warn(message): void
  error(message): void
  fatal(message): void
}

export interface EffectOptions {
  fs?: FileSystem
  prompter?: Prompter
  logger?: Logger
}

export class Effect {
  static fs: FileSystem = fse
  static prompter: Prompter = inquirerPrompter
  static logger: Logger = logger

  public static replace(options: EffectOptions = {}): void {
    if (options.fs) this.fs = options.fs
    if (options.prompter) this.prompter = options.prompter
    if (options.logger) this.logger = options.logger
  }
}
