import { Project, Resource } from '@/internal'
import recursiveExecte from '@/utils/recursive-execte'


interface CheckOptions {
  showDiff?: boolean
  fold?: boolean
  cwd?: string
  noDeps?: boolean
}

export default recursiveExecte(async(options: CheckOptions = {}) => {
  const {
    showDiff = false,
    fold = false,
    cwd = process.cwd(),
    noDeps = false,
  } = options


  const project = await Project.load(cwd)
  const repo = await project.getTemplateRepo()

  const template = await repo.install({ noDeps })
  const resource = new Resource('check', project, template)
  const compiler = await resource.compile()

  await compiler.check({ showDiff , fold })
  await compiler.emit('checked')
})
