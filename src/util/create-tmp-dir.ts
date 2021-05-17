import * as fs from 'fs-extra'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'


export async function createTmpDir(): Promise<string> {
  const id = uuidv4()
  const tmpPath = path.join(__dirname, '../../.mili', id)

  if (await fs.pathExists(tmpPath)) throw new Error('Folder is used by another process.')
  await fs.ensureDir(tmpPath)

  return tmpPath
}

