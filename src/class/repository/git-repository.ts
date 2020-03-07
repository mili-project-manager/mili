import semver from 'semver'
import git from 'simple-git/promise'
import { Repository } from './repository'
import { Effect } from '@/internal'
import { logger } from '@/utils'
import { TEMPLATE_STORAGE } from '@/consts'
import { join } from 'path'


const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/

export class GitRepository extends Repository {
  url: string

  constructor(url) {
    super()
    this.type = 'git'

    this.url = url

    const matched = url.match(gitUrlRegexp)
    const [, , , , , , , links] = matched
    const [owner, name] = links.split('/').slice(-2)
    this.owner = owner
    this.name = name
  }

  get record(): string {
    return this.url
  }

  get storage(): string {
    const { url, version } = this
    return join(TEMPLATE_STORAGE, encodeURIComponent(url), version || 'noversion')
  }

  public async getVersions(): Promise<string[]> {
    if (this.versions) return this.versions

    const result = await git(this.storage).listRemote(['--tags', this.url])
    const arr = result.split('\n')
    const versions = arr
      .filter(item => item.length && !/\^{}$/.test(item))
      .map(item => {
        const [, ref] = item.split(/\s+/)
        const number = ref.substring('refs/tags/v'.length)
        return number
      })
      .filter(version => semver.valid(version))
      .sort((v1, v2) => semver.rcompare(v1, v2))

    if (!versions.length) {
      logger.warn([
        'Cannot get template versions, May be caused by the following reasons:',
        `1. repository is not a mili template(${this.url})`,
        '2. template have not a valid tag to mark the version(e.g. v1.0.0)',
        `3. cannot get versions by command: \`git ls-remote --tags ${this.url}}\``,
      ].join('\n'))
    }

    this.versions = versions
    return versions
  }

  public async download(): Promise<void> {
    const { url, version, storage } = this

    if (!version || version === 'default') {
      if (!version) logger.warn('Version is unset, use the default branch files of git repository')

      await Effect.fs.remove(storage)
      await git(storage).clone(url, storage)
      return
    }

    const repositoryExisted = await Effect.fs.pathExists(storage)

    if (!repositoryExisted) {
      logger.info(`clone template from ${url}...`)
      await git(storage).clone(url, storage, ['--branch', `v${version}`, '--single-branch'])
      logger.info(`template version: ${version}`)
    } else {
      logger.info('use the cache of template')
    }
  }

  public async existed(): Promise<boolean> {
    try {
      const result = await git(this.storage).listRemote([])
      return Boolean(result && result.length)
    } catch (e) {
      return false
    }
  }
}
