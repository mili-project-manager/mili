import fs from 'fs-extra'

export default async function(path: string): Promise<boolean> {
  const stats = await fs.stat(path)
  return stats.isDirectory()
}