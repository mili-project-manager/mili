export interface Handler {
  name: string
  options: Record<string, any>
}

export interface Template {
  path: string
  /**
   * @default 'utf8'
   */
  encoding: 'utf8' | 'binary' | 'hex' | 'ascii'
  /**
   * @default 'cover'
   */
  handlers: Handler[]
}
