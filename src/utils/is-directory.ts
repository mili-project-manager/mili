import { Effect } from '@/internal'

export default async function(path: string): Promise<boolean> {
  const stats = await Effect.fs.stat(path)
  return stats.isDirectory()
}
