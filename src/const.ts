import * as path from 'path'
import * as tempDir from 'temp-dir'


export const TEMPLATE_CACHE_FILEPATH = path.join(tempDir, 'mili', 'template_cache')
export const TEMPLATE_STORAGE_FILEPATH = path.join(tempDir, 'mili', 'template_storage')
export const TEMPORARY_FILEPATH = path.join(tempDir, 'mili', 'temporary')
