import git from 'simple-git/promise'
import dirExist from './dir-exist'


export default async(path: string) => {
  if (!await dirExist(path)) return false
  if (!await git(path).checkIsRepo()) return false

  const toplevel = await git(path).revparse(['--show-toplevel'])
  if (toplevel.replace(/\n$/, '') !== path) return false

  return true
}
