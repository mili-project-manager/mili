import { render } from './render'
import { check } from './util/check'
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
  const tmpDir = cwd

  const repository = parseTemplate(template, version)
  await render(tmpDir, repository, {})
}
