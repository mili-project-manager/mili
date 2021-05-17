import * as fs from 'fs-extra'
import { Answers } from './interface/answers'
import { render } from './render'
import { createTmpDir } from './util/create-tmp-dir'
import { parseTemplate } from './util/parse-template'
import { diff } from './diff'
import { copy } from './util/copy'


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
  showDiff?: boolean

  /**
   * @default false
   */
  fold?: boolean

  /**
   * @default {}
   */
  answers?: Answers
}


export async function check(options: Options): Promise<void> {
  const {
    template,
    version = 'latest',
    cwd = process.cwd(),
    showDiff = false,
    fold = false,
    answers = {},
  } = options

  const tmpDir = await createTmpDir()
  await copy(cwd, tmpDir)

  const repository = parseTemplate(template, version)
  await render(tmpDir, repository, answers)

  await diff(cwd, tmpDir, { fold, showDiff })

  await fs.remove(tmpDir)
}
