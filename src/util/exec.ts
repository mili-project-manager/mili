import { promisify } from 'util'
import * as childProcess from 'child_process'

export const exec = promisify(childProcess.exec)
