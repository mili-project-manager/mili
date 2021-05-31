type RepositoryType = 'npm' | 'git' | 'fs'

interface BaseRepository {
  type: Readonly<RepositoryType>
  name: Readonly<string>
  version: Readonly<string>
  storage: Readonly<string>
}

export interface NpmRepository extends BaseRepository{
  type: 'npm'
  registry?: Readonly<string>
}
export interface GitRepository extends BaseRepository {
  type: 'git'
}
export interface FsRepository extends BaseRepository {
  type: 'fs'
}

export type Repository = NpmRepository | GitRepository | FsRepository


