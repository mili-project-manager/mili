import { Exec } from '@/interface/loader'
import simpleGit from 'simple-git'
import * as isUrl from 'is-url'


interface GitLoaderOptions {
  /**
   * The git remote
   *
   * @default 'origin'
   */
  remote: string
}

interface GitHubResource {
  repository: {
    isGitHubRepo: boolean
    gitHubOwner?: string
    gitHubRepoName?: string
  }
}

interface GitResource extends GitHubResource {
  repository: {
    isRepo: boolean
    isGitHubRepo: boolean
    url?: string
  }
}


function parseRepo(url: string): GitHubResource['repository'] {
  const githubSSHRegExp = /^git@github.com:([-a-zA-Z0-9@:%._+~#=]+)\/([-a-zA-Z0-9@:%._+~#=]+)\.git$/
  const githubHttpRegExp = /https:\/\/github.com\/([-a-zA-Z0-9@:%._+~#=]+)\/([-a-zA-Z0-9@:%._+~#=]+)\.git$/

  let isGitHubRepo = false
  let gitHubOwner: string | undefined
  let gitHubRepoName: string | undefined

  if (isUrl(url)) {
    const matched = url.match(githubHttpRegExp)
    if (matched) {
      isGitHubRepo = true
      gitHubOwner = matched[1]
      gitHubRepoName = matched[2]
    }
  } else {
    const matched = url.match(githubSSHRegExp)
    if (matched) {
      isGitHubRepo = true
      gitHubOwner = matched[1]
      gitHubRepoName = matched[2]
    }
  }


  return {
    isGitHubRepo,
    gitHubOwner,
    gitHubRepoName,
  }
}


export const exec: Exec<GitLoaderOptions, GitResource> = async function(cwd, options) {
  const git = simpleGit(cwd)

  if (!await git.checkIsRepo()) {
    return {
      repository: {
        isRepo: false,
        isGitHubRepo: false,
      },
    }
  }

  const remotes = await git.getRemotes(true)


  if (options.remote) {
    const remote = remotes.find(remote => remote.name === options.remote)
    if (!remote) throw new Error(`The remote ${remote} not existed.`)
    const url = remote.refs.push

    return {
      repository: {
        isRepo: true,
        url,
        ...parseRepo(url),
      },
    }
  } else if (remotes[0]) {
    return {
      repository: {
        isRepo: true,
        url: remotes[0].refs.push ,
        ...parseRepo(remotes[0].refs.push),
      },
    }
  } else {
    return {
      repository: {
        isRepo: true,
        url: '',
        isGitHubRepo: false,
      },
    }
  }
}
