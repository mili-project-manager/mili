import AJV from 'ajv8'
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


export async function render(cwd: string, repository: Repository, answers: Answers, initResource: Record<string, any>): Promise<void> {
  const templatePath = await download(repository, cwd)
  const config = await loadConfig(templatePath)

  if (!initResource.mili) {
    initResource.mili = {
      stack: [],
    }
  }

  if (!initResource.mili.stack) {
    initResource.mili.stack = []
  }

  initResource.mili.stack.push({ ...repository, version: config.version })

  answers = await inquire(config.questions, answers)

  for (const extension of config.extends) {
    if (extension.when) {
      const validate = ajv.compile(extension.when)
      const valid = validate(answers)
      if (!valid) continue
    }

    const subRepository = parseTemplate(extension.template, extension.version, {
      registry: initResource.mili.registry,
      cwd,
    })

    let subAnwsers = R.clone(answers)
    if (extension.answers) subAnwsers = { ...subAnwsers, ...extension.answers }

    await render(
      cwd,
      subRepository,
      subAnwsers,
      R.clone(initResource),
    )
  }


  logger.info(`compile template ${repository.name}...`)
  const resource = new Map<string, any>(Object.entries(initResource))

  for (const loader of config.loaders) {
    const result = await execLoader(cwd, loader)
    for (const [key, value] of Object.entries(result)) {
      if (resource.has(key)) throw new Error(`Key Confilct - Loader:${loader.name}, key:${key}`)

      resource.set(key, value)
    }
  }

  resource.set('answers', answers)

  await compile(cwd, path.join(templatePath, 'templates'), config.templates, resource)
}
