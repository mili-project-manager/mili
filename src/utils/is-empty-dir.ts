import { Effect } from '@/internal'

export default async(path: string): Promise<boolean> => {
  const files = await Effect.fs.readdir(path)
  return !files.length
}
