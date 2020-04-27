import { Project, Resource, Effect, EffectOptions } from '@/internal'
import { recursiveExecte, logger, checkWorkDir } from '@/utils'
import semver from 'semver'


interface UpdateOptions {
  cwd?: string
  noDeps?: boolean
  version?: string
  force?: boolean
  effect?: EffectOptions
}

export default recursiveExecte(async(options: UpdateOptions): Promise<void> => {
  const cwd = options.cwd || process.cwd()
  const noDeps = options.noDeps || false
  const version = options.version
  const force = options.force || false

  Effect.replace(options.effect)

  if (!force) await checkWorkDir(cwd)

  const project = await Project.load(cwd)
  const repo = await project.getTemplateRepo()

  if (version && repo.version && version !== 'default' && version !== 'latest' && semver.lt(version, repo.version)) {
    const message = [
      'The version number setted is lower than the current template version.',
      "If you're sure you want to run this command, rerun it with --force.",
    ].join('\n')

    if (force) logger.warn(message)
    else throw new Error(message)
  }

  if (version) await repo.checkout(version)

  const template = await repo.install({ noDeps })
  const resource = new Resource('update', project, template)
  const compiler = await resource.compile()

  await compiler.render()
  await compiler.emit('updated')
})
