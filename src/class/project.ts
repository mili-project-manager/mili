import git from 'simple-git/promise'
import { basename } from 'path'
import { loadMilirc, loadNpmConfig } from '@/loader'
import { Answers } from './question'
import { Repository, GitRepository, MissingFileError } from '@/internal'
import { hasPath } from 'ramda'
import { isRootDirOfRepo } from '@/utils'
import { Maybe } from '@/types'


export class Project {
  public path: string

  public repository?: Repository

  public name: string | undefined

  public answers?: Answers

  constructor(path: string, name: string = '', repository?: Repository, answers?: Answers) {
    this.path = path
    this.name = name
    this.repository = repository
    this.answers = answers
  }

  public async getTemplateRepo(): Promise<Repository> {
    const milirc = await loadMilirc(this.path)

    if (!milirc) throw new Error('Cannot load milirc')
    if (!hasPath(['template', 'repository'], milirc)) {
      throw new Error('Cannot find repository config in .milirc')
    }

    const version = milirc.template.version
    const repoStr = milirc.template.repository

    const repo = await Repository.format(repoStr)
    if (version) await repo.checkout(version)

    return repo
  }

  public static async load(path: string): Promise<Project> {
    const milirc = await loadMilirc(path)
    let repo: Maybe<Repository>
    let answers: Maybe<Answers>

    if (await isRootDirOfRepo(path)) {
      const remotes = await git(path).getRemotes(true)
      if (remotes && remotes.length) repo = new GitRepository(remotes[0].refs.push)
    }

    if (milirc && milirc.answers) answers = milirc.answers

    try {
      const npmConfig = await loadNpmConfig(path)
      if (npmConfig.repository && npmConfig.repository.type === 'git') {
        repo = new GitRepository(npmConfig.repository.url)
      }

      return new Project(path, npmConfig.name, repo, answers)
    } catch (error) {
      if (error instanceof MissingFileError) {
        return new Project(path, basename(path), repo, answers)
      } else {
        throw error
      }
    }
  }
}
