import { exec } from 'child_process'
import logger from './logger'
import { Path } from '@/consts'


export default (path: Path): Promise<void> => new Promise((resolve, reject) => {
  logger.info('install template dependencies...')

  exec('npm install --production', { cwd: path }, (error, stdout, stderr) => {
    if (error) {
      logger.error('Unable install template dependencies')
      return reject(error)
    }

    // process.stdout.write(stdout)
    process.stderr.write(stderr)
    resolve()
  })
})

