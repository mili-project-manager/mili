import { join } from 'path'
import { homedir } from 'os'

export type Path = Readonly<string>
export const TEMPLATE_STORAGE: Path = join(homedir(), '.mili', 'templates')
