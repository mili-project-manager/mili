import * as chalk from 'chalk'


export function info(message: string): void {
  console.info(chalk.green(`[MILI] ${message}`))
}

export function warn(message: string): void {
  console.warn(chalk.yellow(`[MILI] ${message}`))
}

export function error(message: string): void {
  console.error(chalk.red(`[MILI] ${message}`))
}
