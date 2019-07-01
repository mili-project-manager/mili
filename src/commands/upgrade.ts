import { Project, Resource } from '@/internal'
import { logger, checkWorkDir } from '@/utils'

interface UpgradeOptions {
  cwd?: string
  noDeps?: boolean
  force?: boolean
}

export default async(options: UpgradeOptions): Promise<void> => {
  const cwd = options.cwd || process.cwd()
  const noDeps = options.noDeps || false
  const force = options.force || false

  if (!force) await checkWorkDir(cwd)

  const project = await Project.load(cwd)
  const repo = await project.getTemplateRepo()

  if (await repo.isLatest()) {
    const message = 'The template is already the latest version'
    if (!force) {
      logger.info(message)
      return
    }

    logger.warn(message)
  }

  await repo.checkout('latest')
  const template = await repo.install({ noDeps })
  const resource = new Resource('upgrade', project, template)

  const compiler = await resource.compile()

  await compiler.render()
  await compiler.emit('upgraded')
}