import { Syncable } from './syncable'

interface LoaderOptions {
  [key: string]: any
}

export type Exec<T = LoaderOptions, R = Record<string, any>> = (cwd: string, options: T) => Syncable<R>
