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
}

export async function init(options: Options): Promise<void> {
  const {
    template,
    version = 'latest',
    registry,
    cwd = process.cwd(),
    force = false,
  } = options

  if (!force) await check(cwd)
  const tmpDir = cwd

  const repository = parseTemplate(template, version, { registry, cwd })
  const resource = { mili: { operation: 'init', registry } }
  await render(tmpDir, repository, {}, resource)
}
