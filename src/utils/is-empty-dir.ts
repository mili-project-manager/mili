import fs from 'fs-extra'

export default async(path: string): Promise<boolean> => {
  const files = await fs.readdir(path)
  return !files.length
}