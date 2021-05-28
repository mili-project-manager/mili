import * as fs from 'fs-extra'
import { Answers } from './interface/answers'
import { migrate } from './migrate'
import { render } from './render'
import { check } from './util/check'
import { copy } from './util/copy'
import { createTmpDir } from './util/create-tmp-dir'
import { parseTemplate } from './util/parse-template'
import { syncDir } from './util/sync-dir'


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

  /**
   * @default {}
   */
  answers?: Answers
}


export async function update(options: Options): Promise<void> {
  const {
    template,
    version = 'latest',
    cwd = process.cwd(),
    force = false,
    answers = {},
  } = options

  if (!force) await check(cwd)
  const tmpDir = await createTmpDir()
  await copy(cwd, tmpDir, true)

  const repository = parseTemplate(template, version)
  await render(tmpDir, repository, answers)

  await migrate(tmpDir, repository, version)
  await syncDir(tmpDir, cwd)
  await fs.remove(tmpDir)
}
