import fs from 'fs-extra'
import cosmiconfig from 'cosmiconfig'
import semver from 'semver'
import { join } from 'path'
import Ajv from 'ajv'
import { relativePath, isRelativePath } from '@/utils'
import { MilircSchema } from '@/schema'
import { Milirc } from '@/class'


const ajv = new Ajv({ useDefaults: true, nullable: true })
const validate = ajv.compile(MilircSchema)

const explorer = cosmiconfig('mili')

export default async(cwd: string): Promise<Milirc | null> => {
  let config: Milirc | null = null

  const filepath = join(cwd, '.milirc.yml')
  if (!await fs.pathExists(filepath)) return config

  const result = await explorer.load(filepath)
  if (!result || !result.config) return config

  config = JSON.parse(JSON.stringify(result.config))

  if (!config) throw new Error('Cannot load .milirc.yml')

  if (config.mili && semver.lt(config.mili.version, '2.0.0')) throw new Error('Never support auto upgrade from mili@1')

  const valid = validate(config)

  if (!valid) throw new Error(ajv.errorsText(validate.errors, { dataVar: 'milirc' }))

  /** The relative template path saved in .milirc is relative to the dir of .milirc */
  if (isRelativePath(config.template.repository)) {
    config.template.repository = relativePath(process.cwd(), join(cwd, config.template.repository))
  }

  return config
}
