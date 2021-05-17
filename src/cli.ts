#!/usr/bin/env node
import Ajv from 'ajv'
import { program } from 'commander'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as milircSchema from './schema/milirc.json'
import * as chalk from 'chalk'
import { cosmiconfig } from 'cosmiconfig'
import { version } from '../package.json'
import { init } from './init'
import { upgrade } from './upgrade'
import { update } from './update'
import { Milirc } from './interface/milirc'
import { clean } from './clean'
import { check } from './check'
import * as logger from '@/util/logger'


const ajv = new Ajv()
const validate = ajv.compile(milircSchema)
const explorer = cosmiconfig('mili')


async function getConfig(cwd: string = process.cwd()): Promise<Milirc> {
  const result = await explorer.search(cwd)
  if (!result) throw new Error('Cannot find .milirc.yml or .milirc.json')
  const config = result.config
  const valid = validate(config)
  if (!valid) throw new Error(ajv.errorsText(validate.errors, { dataVar: 'milirc' }))
  return config
}

async function main(): Promise<void> {
  program
    .version(version)

  const absolutize = (val): string => path.resolve(val)

  program
    .command('init <repository>')
    .usage('[options] <repository>')
    .description('initialize the project')
    .option('--force')
    .option('-v --version <version>', 'Set the template version')
    .option('--cwd <cwd>', 'Set the current work directory', absolutize)
    .action(async(repository, option) => {
      const { force = false, cwd, version } = option

      if (cwd) fs.ensureDir(cwd)

      await init({
        cwd,
        template: repository,
        force,
        version,
      })
    })


  program
    .command('upgrade')
    .description('upgrade the template')
    .option('--force')
    .option('--cwd [cwd]', 'Set the current work directory', absolutize)
    .option('-v --version <version>', 'Set the template version')
    .action(async options => {
      const config = await getConfig(options.cwd)

      await upgrade({
        template: config.template,
        version: config.version,
        cwd: options.cwd,
        force: options.force,
        answers: config.answers,
      }, options.version)
    })

  program
    .command('update')
    .description('Update the project with the current version of the template')
    .option('--force')
    .option('--cwd [cwd]', 'Set the current work directory', absolutize)
    .action(async option => {
      const { force = false } = option
      const cwd: string | undefined = option.cwd

      if (cwd && !fs.pathExistsSync(cwd)) throw new Error(`No such directory: ${cwd}`)

      const config = await getConfig(cwd)

      await update({
        template: config.template,
        version: config.version,
        cwd,
        force,
        answers: config.answers,
      })
    })

  program
    .command('clean')
    .description('Clean the cache of mili')
    .action(async() => {
      await clean()
    })


  program
    .command('check [files...]')
    .description('Check if the project file meets the template requirements')
    .option('--cwd [cwd]', 'Set the current work directory', absolutize)
    .option('-d --diff', 'Show file difference')
    .option('--fold', 'fold undifferentiated code')
    .action(async(files, options) => {
      const { cwd, diff, fold } = options
      if (cwd && !fs.pathExistsSync(cwd)) {
        throw new Error(`No such directory: ${cwd}`)
      }

      const config = await getConfig(options.cwd)

      await check({
        template: config.template,
        version: config.version,
        answers: config.answers,
        cwd,
        showDiff: diff,
        fold,
      })
    })

  program.on('command:*', function(operands) {
    logger.error(`error: unknown command '${operands[0]}'`)
    process.exitCode = 1
  })


  try {
    await program.parseAsync(process.argv)
  } catch (e) {
    logger.error(chalk.red(e.message))
    console.log(e.stack)
    process.exitCode = 1
  }
}

main()
