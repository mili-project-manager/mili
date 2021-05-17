import { Exec } from '@/interface/loader'
import * as fs from 'fs-extra'
import * as path from 'path'


interface NpmLoaderOptions {
  /**
   * The default package name
   */
  name: string

  /**
   * The default package version
   */
  version: string

  /**
   * The default package description
   */
  description: string
}

export const exec: Exec<NpmLoaderOptions> = async function(cwd, options) {
  const packageJsonFilepath = path.join(cwd, 'package.json')

  if (!await fs.pathExists(packageJsonFilepath)) {
    return {
      npm: {
        name: options.name || path.basename(path.dirname(cwd)),
        version: options.version || '0.0.1',
        description: options.description || '',
      },
    }
  }

  const config = await fs.readJSON(packageJsonFilepath)

  return {
    npm: {
      name: config.name,
      version: config.version,
      description: config.description,
    },
  }
}
