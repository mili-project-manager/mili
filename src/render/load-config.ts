import AJV from 'ajv8'
import ajvFormats from 'ajv-formats'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as JSON5 from 'json5'
import * as YAML from 'js-yaml'
import * as configSchema from './schema/config.json'
import * as hooksSchema from './schema/hooks.json'
import * as questionsSchema from './schema/questions.json'
import * as templatesSchema from './schema/templates.json'
import * as R from 'ramda'
import { Config } from './interface/config'
import { Hook } from './interface/hook'
import { Question } from './interface/question'
import { Template } from './interface/template'


const ajv = new AJV()
ajvFormats(ajv)

function validate(schema: any, data: any, dataVar: string): true {
  const validator = ajv.compile(schema)
  const valid = validator(data)
  if (!valid) throw new Error(ajv.errorsText(validator.errors, { dataVar }))

  return true
}

async function exist(filepath): Promise<boolean> {
  try {
    await fs.access(filepath)
    return true
  } catch (error) {
    return false
  }
}

async function readJson(filepath: string): Promise<any> {
  const content = await fs.readFile(filepath, { encoding: 'utf8' })
  return JSON5.parse(content)
}
async function readYaml(filepath: string): Promise<any> {
  const content = await fs.readFile(filepath, { encoding: 'utf8' })
  return YAML.load(content) as any
}

async function readConfig(filepath: string): Promise<any> {
  const ymlFilepath = `${filepath}.yml`
  const jsonFilepath = `${filepath}.json`

  if (await exist(ymlFilepath)) {
    return readYaml(ymlFilepath)
  } else if (await exist(jsonFilepath)) {
    return readJson(jsonFilepath)
  }
}

const buildInLoaders = fs.readdirSync(path.join(__dirname, '../loader'))
const buildInHanlders = fs.readdirSync(path.join(__dirname, '../handler'))

export async function loadMiliConfig(dir: string): Promise<Omit<Config, 'questions' | 'templates' | 'hooks'>> {
  const config = await readConfig(path.join(dir, 'mili'))
  validate(configSchema, config, 'config')

  if (!config.version) {
    const packageJson = await readJson(path.join(dir, 'package.json'))
    config.version = packageJson.version
  }

  if (!config.extends) config.extends = []
  if (!config.loaders) config.loaders = []

  config.loaders = config.loaders.map(loader => {
    if (typeof loader === 'string') {
      return {
        name: loader,
        options: {},
      }
    }

    return loader
  })

  config.loaders = config.loaders.map(loader => {
    if (buildInLoaders.includes(`${loader.name}.js`) || buildInLoaders.includes(loader.name)) {
      return {
        name: path.join(__dirname, '../loader', loader.name),
        options: loader.options,
      }
    } else {
      return {
        name: path.join(dir, 'node_modules', loader.name),
        options: loader.options,
      }
    }
  })

  config.extends = config.extends.map(ext => {
    if (typeof ext === 'string') {
      return {
        template: ext,
        version: 'latest',
      }
    }

    return ext
  })

  return config
}

export async function loadHooksConfig(dir: string): Promise<Hook[]> {
  const config: Record<Hook['name'], string> = await readConfig(path.join(dir, 'hooks'))
  if (!config) return []

  validate(hooksSchema, config, 'hooks')
  const pair = Object.entries(config) as [Hook['name'], string][]

  return pair.map(([name, exec]) => ({ name, exec }))
}

export async function loadQuestionsConfig(dir: string): Promise<Question[]> {
  const config = await readConfig(path.join(dir, 'questions'))
  if (!config) return []

  validate(questionsSchema, config, 'questions')
  return config
}

export async function loadTemplateConfig(dir: string): Promise<Template[]> {
  const config = await readConfig(path.join(dir, 'templates'))
  validate(templatesSchema, config, 'templates')


  config.push({
    path: '**',
    encoding: 'utf8',
    handlers: ['overwrite'],
  })

  return R.unnest(config.map(item => {
    if (!item.encoding) item.encoding = 'utf8'
    if (!item.handlers || !item.handlers.length) item.handlers = ['overwrite']

    item.handlers = item.handlers.map(handler => {
      if (typeof handler === 'string') {
        return {
          name: handler,
          options: {},
        }
      }

      return handler
    })

    if (item.handlers[item.handlers.length - 1].name !== 'overwrite') {
      item.handlers.push({
        name: 'overwrite',
        options: {},
      })
    }


    item.handlers = item.handlers.map(handler => {
      if (buildInHanlders.includes(`${handler.name}.js`) || buildInHanlders.includes(handler.name)) {
        return {
          name: path.join(__dirname, '../handler', handler.name),
          options: handler.options,
        }
      } else {
        return {
          name: path.join(dir, 'node_modules', handler.name),
          options: handler.options,
        }
      }
    })

    if (Array.isArray(item.path)) {
      return item.path.map(subpath => {
        const handler = R.clone(item)
        handler.path = subpath
        return handler
      })
    }

    return item
  }))
}

export async function loadConfig(dir: string): Promise<Config> {
  const config = await loadMiliConfig(dir)

  return {
    ...config,
    hooks: await loadHooksConfig(dir),
    questions: await loadQuestionsConfig(dir),
    templates: await loadTemplateConfig(dir),
  }
}
