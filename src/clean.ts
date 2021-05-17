import * as fs from 'fs-extra'
import { TEMPLATE_CACHE_FILEPATH, TEMPLATE_STORAGE_FILEPATH, TEMPORARY_FILEPATH } from './const'


export async function clean(): Promise<void> {
  await Promise.all([
    fs.remove(TEMPLATE_STORAGE_FILEPATH),
    fs.remove(TEMPORARY_FILEPATH),
    fs.remove(TEMPLATE_CACHE_FILEPATH),
  ])
}
