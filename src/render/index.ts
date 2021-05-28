import AJV from 'ajv'
import * as R from 'ramda'
import * as path from 'path'
import { Answers } from '@/interface/answers'
import { Repository } from '@/interface/repository'
import { parseTemplate } from '@/util/parse-template'
import * as logger from '@/util/logger'
import { download } from './download'
import { loadConfig } from './load-config'
import { inquire } from './inquire'
import { execLoader } from './exec-loader'
import { compile } from './compile'


const ajv = new AJV()

export async function render(cwd: string, repository: Repository, answers: Answers): Promise<void> {
  const templatePath = await download(repository)
  const config = await loadConfig(templatePath)

  answers = await inquire(config.questions, answers)

  logger.info('compile template...')
  for (const extension of config.extends) {
    if (extension.when) {
      const validate = ajv.compile(extension.when)
      const valid = validate(answers)
      if (!valid) continue
    }

    const subRepository = parseTemplate(extension.template, extension.version)

    let subAnwsers = R.clone(answers)
    if (extension.answers) subAnwsers = { ...subAnwsers, ...extension.answers }

    render(cwd, subRepository, subAnwsers)
  }


  const resource = new Map<string, any>()

  for (const loader of config.loaders) {
    const result = await execLoader(cwd, loader)
    for (const [key, value] of Object.entries(result)) {
      if (resource.has(key)) throw new Error(`Key Confilct - Loader:${loader.name}, key:${key}`)

      resource.set(key, value)
    }
  }

  resource.set('answers', answers)
  resource.set('milirc', {
    template: repository.name,
    version: config.version,
  })

  await compile(cwd, path.join(templatePath, 'templates'), config.templates, resource)
}
