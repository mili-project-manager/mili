
const gitUrlRegexp = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/

export default function(str: string): boolean {
  return gitUrlRegexp.test(str)
}