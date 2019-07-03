import { isDirectory } from '@/utils'
import { Effect } from '@/internal'


export default async(path: string): Promise<boolean> => {
  const exist = await Effect.fs.pathExists(path)
  if (!exist) return false

  return await isDirectory(path)
}
