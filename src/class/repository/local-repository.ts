import git from 'simple-git/promise'
import semver from 'semver'
import { relative, join, isAbsolute, basename } from 'path'
import { Repository } from './repository'
import { TEMPLATE_STORAGE } from '@/consts'
import { logger, dirExist, isRootDirOfRepo, isRelativePath } from '@/utils'
import { Effect } from '@/internal'
import { ResetMode } from 'simple-git'


export class LocalRepository extends Repository {
  absolute = false

  path: string

  constructor(str) {
    super()
    this.type = 'local'
    this.name = basename(str)

    const path = str
    const cwd = process.cwd()

    if (isAbsolute(path)) {
      this.absolute = true
      this.path = path
    } else {
      this.path = join(cwd, path)
    }
  }

  get record(): string | ((projectPath: string) => string) {
    if (this.absolute) return this.path
    /** the path saved in .milirc should be relative to the output folder, rather than process.cwd() */
    return projectPath => {
      const relativePath = relative(projectPath, this.path)

      if (isRelativePath(relativePath)) return relativePath
      else return `./${relativePath}`
    }
  }

  get storage(): string {
    return join(TEMPLATE_STORAGE, encodeURIComponent(this.path), this.version || 'noversion')
  }

  public async getVersions(): Promise<string[]> {
    const { path } = this
    if (this.versions) return this.versions
    if (!(await git(path).checkIsRepo()) || !await isRootDirOfRepo(path)) {
      this.versions = []
      return this.versions
    }

    const tags = await git(path).tags()

    if (!tags.all.length) {
      logger.warn([
        'Cannot get template versions, May be caused by the following reasons:',
        `1. repository is not a mili template(${path})`,
        '2. template have not a valid tag to mark the version(e.g. v1.0.0)',
        `3. cannot get versions by command: \`git tags ${path}\``,
      ].join('\n'))
    }

    this.versions = tags.all
      .map(tag => semver.clean(tag) || '')
      .filter(tag => Boolean(tag))
      .reverse()

    return this.versions
  }

  public async download(): Promise<void> {
    const { path, version, storage } = this

    await Effect.fs.emptyDir(storage)
    logger.info(`copy template from ${path}`)
    await Effect.fs.copy(path, storage)

    if (isRootDirOfRepo(storage) && version && version !== 'default') {
      await git(storage).reset(ResetMode.HARD)
      await git(storage).checkout(`v${version}`)

      logger.info(`template version: ${version}`)
    } else if (version !== 'default') {
      logger.warn('Version is unset, use the default files')
    }
  }

  public async existed(): Promise<boolean> {
    return await dirExist(this.path)
  }
}
