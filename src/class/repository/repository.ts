import { join, isAbsolute } from 'path'
import validateNpmPackageName from 'validate-npm-package-name'
import { isRelativePath, installDeps, logger } from '@/utils'
import { Template, GitRepository, NpmRepository, LocalRepository, Effect } from '@/internal'
import * as semver from 'semver'


export type RepositoryTypes = 'npm' | 'local' | 'git'
export interface InstallOptions {
  noDeps?: boolean
}

export abstract class Repository {
  type!: RepositoryTypes
  owner = ''
  name = ''
  version?: string
  protected versions: string[] | null = null


  public static async format(str: string): Promise<Repository> {
    const githubSH = /^(github:)[-a-zA-Z0-9@:%._+~#=]+\/[-a-zA-Z0-9@:%._+~#=]+$/
    const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/
    let repo: Repository

    if (isRelativePath(str) || isAbsolute(str)) {
      const localRepo = new LocalRepository(str)
      if (!await localRepo.existed()) {
        throw new Error(`Template path cannot be found. Ensure it is an exist directory: ${localRepo.path}.`)
      }
      repo = localRepo
    } else if (gitUrlRegexp.test(str)) {
      repo = new GitRepository(str)
    } else if (/^npm:/.test(str) && validateNpmPackageName(str.substring('npm:'.length))) {
      repo = new NpmRepository(str.substring('npm:'.length))
    } else if (githubSH.test(str)) {
      repo = new GitRepository(`https://github.com/${str.replace(/^github:/, '')}.git`)
    } else {
      throw new Error(`Invalid repository url: ${str}`)
    }

    if (!await repo.isVerioning()) logger.warn('The template repository is not versioned.')

    await repo.checkout('latest')

    return repo
  }

  public async hasVersion(version: string): Promise<boolean> {
    const versions = await this.getVersions()
    return versions.includes(version)
  }


  public async checkout(version = 'latest'): Promise<void> {
    if (version !== 'latest' && version !== 'default' && !semver.valid(version)) {
      throw new Error('Semantic version expected.')
    }

    const versions = await this.getVersions()

    if (version === 'default') {
      this.version = 'default'
    } else if (version === 'latest') {
      if (versions.length) this.version = versions[0]
      else this.version = undefined
    } else if (versions.includes(version)) {
      this.version = version
    } else {
      throw new Error(`Cannot find template for the version ${version} `)
    }
  }

  public async isVerioning(): Promise<boolean> {
    const versions = await this.getVersions()
    if (versions.length) return true
    return false
  }

  public async isLatest(): Promise<boolean> {
    const versions = await this.getVersions()
    if (versions.length && this.version === versions[0]) return true
    return false
  }

  private async installDeps(): Promise<void> {
    const { storage } = this

    const npmConfigFile = join(storage, 'package.json')
    const npmConfigFileExist = await Effect.fs.pathExists(npmConfigFile)
    if (npmConfigFileExist) await installDeps(storage)
  }


  public async install(options: InstallOptions = {}): Promise<Template> {
    const { version } = this
    if (version && !this.hasVersion(version)) {
      throw new Error(`The template version ${version} is not existed.`)
    }

    await this.download()
    if (!options.noDeps) await this.installDeps()
    return Template.load(this)
  }

  abstract get storage(): string

  abstract get record(): string | ((projectPath: string) => string)

  public abstract existed(): Promise<boolean>

  /**
   * get repository versions list.
   * In the order from new to old.
   */
  public abstract getVersions(): Promise<string[]>

  public abstract download(): Promise<void>
}
