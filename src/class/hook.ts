import childProcess from 'child_process'
import { promisify } from 'util'
import { logger } from '@/utils'
import { EventEmitter } from 'events'


const exec = promisify(childProcess.exec)

export type Listener = (...arg: any[]) => void

export class Hook {
  public eventName: string

  public listener: Listener

  /*
   * constructor(eventName: string, listener: string)
   * constructor(eventName: string, listener: Listener)
   */
  constructor(eventName: string, listener: Listener | string) {
    this.eventName = eventName

    if (typeof listener === 'string') {
      this.listener = async() => {
        logger.info(`run ${eventName} hook...`)

        try {
          const { stdout, stderr } = await exec(listener)

          process.stdout.write(stdout)
          process.stderr.write(stderr)
        } catch (error) {
          logger.error('hook exec error', error)
        }
      }
    } else if (typeof listener === 'function') {
      this.listener = async(...arg) => {
        logger.info(`run ${eventName} hook...`)
        await listener(...arg)
      }
    } else {
      throw new Error('Hook should be a string or function')
    }
  }

  public appendTo(eventEmitter: EventEmitter): void {
    eventEmitter.addListener(this.eventName, this.listener)
  }
}

export type Hooks = Hook[]
