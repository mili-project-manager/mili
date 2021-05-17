import { Path } from '@/interface/path'
import { exec } from './exec'
import * as fs from 'fs-extra'
import * as path from 'path'


export async function installDeps(cwd: Path): Promise<void> {
  if (await fs.pathExists(path.join(cwd, 'package.json'))) {
    await exec('npm install --production', { cwd })
  }
}
