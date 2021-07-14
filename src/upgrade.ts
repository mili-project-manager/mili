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
   * The npm Registry
   */
  registry?: string
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

export async function upgrade(options: Options, version = 'latest'): Promise<void> {
  const {
    template,
    version: fromVersion = 'latest',
    registry,
    cwd = process.cwd(),
    force = false,
    answers = {},
  } = options

  if (!force) await check(cwd)
  const tmpDir = await createTmpDir()
  await copy(cwd, tmpDir, true)

  const repository = parseTemplate(template, version, { registry, cwd })
  const resource = { mili: { operation: 'upgrade', registry } }
  await render(tmpDir, repository, answers, resource)

  migrate(tmpDir, repository, fromVersion)
  await syncDir(tmpDir, cwd)
  await fs.remove(tmpDir)
}
