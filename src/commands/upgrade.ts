import { Project, Resource, Effect, EffectOptions } from '@/internal'
import { recursiveExecte, logger, checkWorkDir } from '@/utils'
import * as semver from 'semver'

interface UpgradeOptions {
  cwd?: string
  noDeps?: boolean
  force?: boolean
  effect?: EffectOptions
}

export default recursiveExecte(async(options: UpgradeOptions): Promise<void> => {
  const cwd = options.cwd || process.cwd()
  const noDeps = options.noDeps || false
  const force = options.force || false

  Effect.replace(options.effect)

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

  const currentVersion = repo.version

  await repo.checkout('latest')

  if (currentVersion && currentVersion !== 'default' && repo.version && semver.diff(currentVersion, repo.version) === 'major') {
    logger.warn(`The template upgrade a major version from ${currentVersion} to ${repo.version}. Please view the template breaking change first.`)
  }

  const template = await repo.install({ noDeps })
  const resource = new Resource('upgrade', project, template)

  const compiler = await resource.compile()

  await compiler.render()
  await compiler.emit('upgraded')
})
