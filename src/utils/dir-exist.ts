import fs from 'fs-extra'
import { isDirectory } from '@/utils'


export default async(path: string): Promise<boolean> => {
  const exist = await fs.pathExists(path)
  if (!exist) return false

  return await isDirectory(path)
}