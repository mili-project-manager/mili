import { logger } from '@/utils'
import { Project } from '@/internal'


interface OutdatedOptions {
  cwd?: string
}

export default async(options: OutdatedOptions = {}) => {
  const cwd = options.cwd || process.cwd()

  const project = await Project.load(cwd)
  const repo = await project.getTemplateRepo()

  if (await repo.isVerioning()) {
    throw new Error('`mili outdated` cannot check the template without version control')
  } else if (await repo.isLatest()) {
    logger.info('Congratulations, the current template is the latest version.')
  } else {
    logger.warn([
      '',
      '',
      'Project Mili Template Is Outdated',
      'run `npx mili upgrade` to upgrade template',
      '',
      '',
    ].join('\n'))
  }
}
