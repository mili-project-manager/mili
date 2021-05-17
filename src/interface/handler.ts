import { Path } from './path'
import { Syncable } from './syncable'


export interface CompielOptions {
  encoding: 'utf8' | 'binary' | 'hex' | 'ascii'
  [key: string]: any
}

export type Compile <T = CompielOptions> = (dist: Path, src: Path, filepath: Path, resource: Map<string, any>, options: T) => Syncable<Path | void>
