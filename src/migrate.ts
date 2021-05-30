import { Repository } from './interface/repository'
import * as semver from 'semver'
import * as fs from 'fs-extra'
import * as path from 'path'
import { execFileSync } from 'child_process'


export function migrate(cwd: string, repository: Repository, fromVersion: string): void {
  if (fromVersion === repository.version) return
  if (!semver.valid(fromVersion)) throw new Error(`Invalid version ${fromVersion}`)


  if (!fs.pathExistsSync(path.join(repository.storage, 'migration'))) return

  const files = fs.readdirSync(path.join(repository.storage, 'migration'))
  for (const file of files) {
    execFileSync(file, [], { cwd })
  }
}
