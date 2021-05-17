type RepositoryType = 'npm' | 'git' | 'fs'
export interface Repository {
  type: Readonly<RepositoryType>
  name: Readonly<string>
  version: Readonly<string>
  storage: Readonly<string>
}
