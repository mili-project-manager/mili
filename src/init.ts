import * as fs from 'fs-extra'
import { render } from './render'
import { check } from './util/check'
import { createTmpDir } from './util/create-tmp-dir'
import { parseTemplate } from './util/parse-template'


interface Options {
  template: string
  /**
   * @default 'latest'
   */
  version?: string
  /**
   * @default process.cwd()
   */
  cwd?: string
  /**
   * @default false
   */
  force?: boolean
}

export async function init(options: Options): Promise<void> {
  const {
    template,
    version = 'latest',
    cwd = process.cwd(),
    force = false,
  } = options

  if (!force) await check(cwd)
  const tmpDir = await createTmpDir()

  const repository = parseTemplate(template, version)
  await render(tmpDir, repository, {})

  await fs.copy(tmpDir, cwd)
  await fs.remove(tmpDir)
}
