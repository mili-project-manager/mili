import simpleGit from 'simple-git'
import * as fs from 'fs-extra'
import * as path from 'path'


const reminder = [
  'This command may overwrite some files',
  "If you're sure to run the command, rerun it with --force.",
].join('\n')


function isEmptyDir(dir: string): boolean {
  const files = fs.readdirSync(dir)
  return !files.length
}

export function isChildPathOf(parent: string) {
  return (child: string): boolean => {
    if (child === parent) return false
    const parentTokens = parent.split('/').filter(i => i.length)
    const childTokens = child.split('/').filter(i => i.length)
    return parentTokens.every((t, i) => childTokens[i] === t)
  }
}


async function isWorkDirClean(dir: string): Promise<boolean> {
  const git = simpleGit(dir)

  const stdout = await git.raw(['ls-files', '--exclude-standard', '--others', '-m'])
  const files = stdout ? stdout.split('\n') : []

  let toplevel = await git.revparse(['--show-toplevel'])
  toplevel = toplevel.replace(/\n$/, '')

  return !files
    .map(file => path.join(toplevel, file))
    .filter(isChildPathOf(dir))
    .length
}

export async function check(dir: string): Promise<boolean> {
  if (!await fs.pathExists(dir)) throw new Error(`Not Existed Dir: ${dir}`)
  const git = simpleGit(dir)

  const isRepo = await git.checkIsRepo()
  if (isRepo) {
    if (!(await isWorkDirClean(dir))) {
      throw new Error([
        'Git working directory not clean',
        reminder,
      ].join('\n'))
    }
  } else if (!isEmptyDir(dir)) {
    throw new Error([
      'The project directory is not empty.',
      reminder,
    ].join('\n'))
  }

  return true
}
