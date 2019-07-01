import { getLogger } from 'log4js'

const logger = getLogger('mili-core')

if (process.env.NODE_ENV === 'development') logger.level = 'debug'
else logger.level = 'info'

export default logger
