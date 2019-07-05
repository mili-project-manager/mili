import cosmiconfig from 'cosmiconfig'
import semver from 'semver'
import { join } from 'path'
import Ajv from 'ajv'
import { relativePath, isRelativePath } from '@/utils'
import { MilircSchema } from '@/schema'
import { Milirc, Effect } from '@/internal'
import { clone } from 'ramda'


const ajv = new Ajv({ useDefaults: true, nullable: true })
const validate = ajv.compile(MilircSchema)

const explorer = cosmiconfig('mili')

export default async(cwd: string): Promise<Milirc | null> => {
  const filepath = join(cwd, '.milirc.yml')
  if (!await Effect.fs.pathExists(filepath)) return null

  /**
   * NOTE: don't change the object that return by cosmiconfig.
   *       It was cache by cosmiconfig
   */
  const result = await explorer.load(filepath)
  if (!result || !result.config) return null

  const config = clone(result.config)
  if (!config) throw new Error('Cannot load .milirc.yml')

  /* Should before validate. mili@1 config won't pass validator */
  if (config.mili && semver.lt(config.mili.version, '2.0.0')) throw new Error('Never support auto upgrade from mili@1')

  const valid = validate(config)
  if (!valid) throw new Error(ajv.errorsText(validate.errors, { dataVar: 'milirc' }))
  const milirc: Milirc = config as Milirc


  /** The relative template path saved in .milirc is relative to the dir of .milirc */
  if (isRelativePath(config.template.repository)) {
    config.template.repository = relativePath(process.cwd(), join(cwd, config.template.repository))
  }

  return milirc
}
