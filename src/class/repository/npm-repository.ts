import childProcess from 'child_process'
import { promisify } from 'util'
import fs from 'fs-extra'
import { join } from 'path'
import { Repository } from './repository'
import { logger } from '@/utils'
import { TEMPLATE_STORAGE } from '@/consts'


const genIndexFile = (name: string): string => `
const { join } = require('path')
const config = require('${name}')
config.path = join('./node_modules/${name}', config.path)

module.exports = config
`

const exec = promisify(childProcess.exec)
export class NpmRepository extends Repository {
  public scope: string | null

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
    if (!version) throw new Error('Please checkout version before install npm template')

    await fs.emptyDir(storage)

    logger.info(`install ${name} template from npm...`)

    await fs.writeJSON(join(storage, 'package.json'), {
      main: 'index.js',
      description: '',
      license: 'MIT',
    })
    await fs.writeFile(join(storage, 'index.js'), genIndexFile(name))
    await fs.writeFile(join(storage, '.npmrc'), 'package-lock=false')

    const command = `npm install ${name}@${version}`
    await exec(command, { cwd: storage })
  }

  public async existed(): Promise<boolean> {
    const out = await exec(`npm view ${this.name} --json`)
    return !out.stderr
  }
}
