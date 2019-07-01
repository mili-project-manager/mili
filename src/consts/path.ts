import { join } from 'path'

export type Path = Readonly<string>
export const TEMPLATE_STORAGE: Path = join(__dirname, '../templates')
