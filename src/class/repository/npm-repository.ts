import childProcess from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { Repository } from './repository'
import { logger } from '@/utils'
import { TEMPLATE_STORAGE } from '@/consts'
import { Effect } from '@/internal'


const genIndexFile = (name: string): string => `
const { join } = require('path')
const config = require('${name}')
const path = join('./node_modules/${name}', config.path)

module.exports = { ...config, path }
`

const exec = promisify(childProcess.exec)
export class NpmRepository extends Repository {
  scope: string | null

  constructor(name) {
    super()

    this.type = 'npm'
    this.name = name

    const matched = name.match(/@(.*)\//)
    if (matched) this.scope = matched[1]
    else this.scope = null
  }

  get record(): string {
    return `npm:${this.name}`
  }

  get storage(): string {
    return join(TEMPLATE_STORAGE, encodeURIComponent(this.name), this.version || 'noversion')
  }

  public async getVersions(): Promise<string[]> {
    if (this.versions) return this.versions

    const { stdout, stderr } = await exec(`npm view ${this.name} versions  --json`)
    if (stderr) console.error(stderr)
    return JSON.parse(stdout).reverse()
  }

  public async download(): Promise<void> {
    const { name, version, storage } = this
    if (version === 'default' || !version) throw new Error('Please checkout version before install npm template')

    const repositoryExisted = await Effect.fs.pathExists(storage)
    if (repositoryExisted) {
      logger.info('use the cache of template')
      return
    }

    logger.info(`install ${name} template from npm...`)
    await Effect.fs.emptyDir(storage)
    await Effect.fs.writeJSON(join(storage, 'package.json'), {
      main: 'index.js',
      description: '',
      license: 'MIT',
    })
    await Effect.fs.writeFile(join(storage, 'index.js'), genIndexFile(name))
    await Effect.fs.writeFile(join(storage, '.npmrc'), 'package-lock=false')

    const command = `npm install ${name}@${version}`
    await exec(command, { cwd: storage })
  }

  public async existed(): Promise<boolean> {
    const out = await exec(`npm view ${this.name} --json`)
    return !out.stderr
  }
}
