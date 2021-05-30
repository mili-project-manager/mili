import { Exec } from '@/interface/loader'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as schema from './schema.json'
import Ajv from 'ajv'


const ajv = new Ajv()
const validate = ajv.compile(schema)

interface MarkdownSectionLoaderOptions {
  /**
   * The resource key
   */
  key: string

  /**
   * The filepath
   */
  filepath: string

  /**
   * The file encoding
   *
   * @default 'utf8'
   */
  encoding: string

  /**
   * The findind sections
   */
  sections: string
}

export const exec: Exec<MarkdownSectionLoaderOptions> = async function(cwd, options) {
  if (!validate(options)) throw new Error(ajv.errorsText(validate.errors))

  const filepath = path.join(cwd, options.filepath)

  if (!await fs.pathExists(filepath)) {
    return {
      [options.key]: {},
    }
  }

  const content = await fs.readFile(filepath, options.encoding || 'utf8')
  const resource = {
    [options.key]: {},
  }

  for (const section of options.sections) {
    const tag = `<!-- ${section} -->`
    let beginIndex = content.indexOf(tag)
    if (beginIndex === -1) continue

    beginIndex += tag.length
    const endIndex = content.indexOf(tag, beginIndex)

    if (endIndex === -1) continue

    resource[options.key][section] = content.substring(beginIndex, endIndex)
  }

  return resource
}
