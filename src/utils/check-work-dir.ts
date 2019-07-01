import { join } from 'path'
import git from 'simple-git/promise'
import { isChildPathOf, isEmptyDir } from '@/utils'


const reminder = [
  'This command may cause some files to be overwritten',
  "If you're sure you want to run this command, rerun it with --force.",
].join('\n')

const isWorkDirClean = async(path: string): Promise<boolean> => {
  const isRepo = await git(path).checkIsRepo()
  if (!isRepo) throw new Error('The work directory checked should be an repository')

  const { files } = await git(path).status()
  let toplevel = await git(path).revparse(['--show-toplevel'])
  toplevel = toplevel.replace(/\n$/, '')

  return !files
    .map(file => join(toplevel, file.path))
    .filter(isChildPathOf(path))
    .length
}

export default async(path: string): Promise<void> => {
  const isRepo = await git(path).checkIsRepo()

  if (!isRepo && !(await isEmptyDir(path))) {
    throw new Error([
      'The project directory is not a git repository and is a non-empty folder.',
      reminder,
    ].join('\n'))
  } else if (isRepo && !(await isWorkDirClean(path))) {
    throw new Error([
      'Git working directory not clean',
      reminder,
    ].join('\n'))
  }
}
