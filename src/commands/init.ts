import { Repository, Resource, Project } from '@/internal'
import { checkWorkDir } from '@/utils'

interface InitOptions {
  cwd?: string
  name?: string
  noDeps?: boolean
  version?: string
  force?: boolean
  repository?: string
}

export default async(options: InitOptions): Promise<void> => {
  const cwd = options.cwd || process.cwd()
  const name = options.name
  const noDeps = options.noDeps || false
  const version = options.version || 'latest'
  const force = options.force || false

  if (!options.repository) throw new TypeError('options.repository is required for `mili.init(options)`')

  if (force) await checkWorkDir(cwd)

  const repo = await Repository.format(options.repository)
  if (version) repo.checkout(version)
  const template = await repo.install({ noDeps })
  const project = await Project.load(cwd)
  if (options.name) project.name = name

  const resource = new Resource('init', project, template)
  const compiler = await resource.compile()

  await compiler.render({ ignoreAnswered: true })
  await compiler.emit('initialized')
}
