import fs from 'fs-extra'
import { join } from 'path'
import { MissingFileError } from '../class/error/missing-file-error'
import { validateGitRepoUrl } from '@/utils'


interface NpmConfig {
  main?: string
  name?: string
  repository?: {
    type?: 'git'
    url?: string
  }
}


export default async(path: string): Promise<NpmConfig> => {
  const packageJsonPath = join(path, 'package.json')
  const exist = await fs.pathExists(packageJsonPath)

  if (!exist) throw new MissingFileError(path)

  try {
    const config: NpmConfig = await fs.readJson(packageJsonPath)

    if (typeof config.repository === 'string') {
      if (validateGitRepoUrl(config.repository)) {
        config.repository = { type: 'git', url: config.repository }
      } else {
        config.repository = { url: config.repository }
      }
    } if (typeof config.repository === 'object') {
      if (config.repository.type === 'git' && config.repository.url) {
        const url = config.repository.url.replace(/^git\+/, '')
        config.repository = { type: 'git', url }
      } else {
        config.repository = { url: config.repository.url }
      }
    } else {
      config.repository = undefined
    }

    if (typeof config.main !== 'string') config.main = undefined

    return config
  } catch (e) {
    throw new Error([
      `Cannot load package.json from ${path}.`,
      'Maybe syntax error in package.json',
    ].join('\n'))
  }
}
