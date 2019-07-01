import { relative } from 'path'

export default (root: string, path: string) => `./${relative(root, path)}`
