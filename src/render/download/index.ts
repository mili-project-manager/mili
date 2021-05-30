import simpleGit from 'simple-git'
import * as semver from 'semver'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Path } from '@/interface/path'
import { Repository } from '@/interface/repository'
import { copy } from '@/util/copy'
import * as logger from '@/util/logger'
import { exec } from './exec'
import { installDeps } from './install-deps'


export async function hasCache(repository: Repository): Promise<boolean> {
  if (semver.valid(repository.version)) {
    const existed = await fs.pathExists(repository.storage)
    if (existed) {
      logger.info(`use the ${repository.name} template cache`)
      return existed
    }
  }
  return false
}

export async function download(repository: Repository): Promise<Path> {
  if (repository.type === 'git') {
    if (await hasCache(repository)) return repository.storage
    await fs.ensureDir(repository.storage)
    logger.info(`clone ${repository.name} template from git...`)

    const git = simpleGit(repository.storage)

    const version = semver.valid(repository.version) ? `v${repository.version}` : repository.version

    await fs.emptyDir(repository.storage)
    await git.clone(repository.name, repository.storage, ['--branch', version, '--single-branch'])

    await installDeps(repository.storage)
    return repository.storage
  } else if (repository.type === 'npm') {
    logger.info(`install ${repository.name} template from npm...`)
    const templatePath = path.join(repository.storage, 'node_modules', repository.name)
    if (hasCache(repository)) templatePath
    await fs.ensureDir(repository.storage)

    await fs.emptyDir(repository.storage)
    await fs.writeJSON(path.join(repository.storage, 'package.json'), {
      main: 'index.js',
      description: '',
      license: 'MIT',
    })

    const command = `npm install --production ${repository.name}@${repository.version}`
    await exec(command, { cwd: repository.storage })

    return templatePath
  } else if (repository.type === 'fs') {
    logger.info(`copy ${repository.name} template from file system...`)
    await fs.emptyDir(repository.storage)
    await copy(repository.name, repository.storage)
    await installDeps(repository.storage)
    return repository.storage
  }

  throw new Error(`Unable download the repository ${repository.name}`)
}
