import * as PrettyError from 'pretty-error'

export const pe = new PrettyError()
export function prettyError(e: unknown): string {
  return pe.render(e instanceof Error ? e : new Error(String(e)))
}
