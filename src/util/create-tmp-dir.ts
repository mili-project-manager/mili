import { TEMPORARY_FILEPATH } from '@/const'
import * as fs from 'fs-extra'
import * as path from 'path'
import { nanoid } from 'nanoid'


export async function createTmpDir(): Promise<string> {
  const tmpPath = path.join(TEMPORARY_FILEPATH , nanoid())

  if (await fs.pathExists(tmpPath)) throw new Error('Folder is used by another process.')
  await fs.ensureDir(tmpPath)

  return tmpPath
}

