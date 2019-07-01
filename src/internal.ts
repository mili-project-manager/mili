/* Fix nasty circular dependency issues */
export * from './class/index'
export * from './types'

import * as handlers from './handlers'
export const buildInHandlers = handlers
