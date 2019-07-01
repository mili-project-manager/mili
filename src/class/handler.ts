import { CompiledFile, Resource } from '@/internal'
import { buildInHandlers } from '@/internal'

export interface FileGenerator {
  (file: CompiledFile, resource: Readonly<Resource>): Promise<void>
}
export interface PathGenerator {
  (path: string, resource: Readonly<Resource>): Promise<string>
}

const identity: PathGenerator = async path => path

interface HandlerDuck {
  genFile: FileGenerator
  genPath: PathGenerator
}

export class Handler {
  public genFile: FileGenerator

  public genPath: PathGenerator

  constructor(genFile: FileGenerator, genPath: PathGenerator = identity) {
    this.genFile = genFile
    this.genPath = genPath
  }

  public static compose(handlers: Handler[]): Handler {
    const genFile: FileGenerator = async(file, config) => {
      for (const handler of handlers) {
        await handler.genFile(file, config)
      }
    }

    const genPath: PathGenerator = async(string, config) => {
      let str = string
      for (const handler of handlers) {
        str = await handler.genPath(str, config)
      }

      return str
    }

    return new Handler(genFile, genPath)
  }

  public static find(name: string): Handler | null {
    if (name in buildInHandlers) return buildInHandlers[name]
    return null
  }

  public static format(handler: string | HandlerDuck | ((buildIn) => Handler)): Handler {
    if (typeof handler === 'string') {
      const h = Handler.find(handler)
      if (h) return h
      else throw new Error(`Cannot find ${handler} handler `)
    } else if (typeof handler === 'function') {
      const h = handler(buildInHandlers)
      if (h instanceof Handler) return h
    } else if (typeof handler === 'object') {
      return new Handler(handler.genFile, handler.genPath)
    }

    throw new TypeError('Cannot format handler')
  }
}

export type Handlers = Handler[]
