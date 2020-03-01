import Ajv from 'ajv'
import ajvKeywords from 'ajv-keywords'
import { join, dirname } from 'path'
import { cosmiconfig } from 'cosmiconfig'
import { unnest, clone } from 'ramda'
import { loadNpmConfig } from '@/loader'
import { TemplateSchema, RuleSchema, QuestionSchema, HandlerSchema } from '@/schema'
import { isDirectory, logger } from '@/utils'
import { UpgradeType } from '@/consts'
import {
  Repository,
  Hook,
  Hooks,
  Listener,
  Resource,
  File,
  Files,
  CheckOptions,
  Question,
  Questions,
  Rule,
  Effect,
  CompiledFile,
  CompiledFiles,
} from '@/internal'


const ajv = new Ajv({ useDefaults: true, $data: true })
ajvKeywords(ajv)
const validateTemplateConfig = ajv
  .addSchema([HandlerSchema])
  .addSchema([RuleSchema, QuestionSchema])
  .compile(TemplateSchema)


export class Template {
  readonly repository: Repository

  path: string

  engines: string

  files: Files

  questions: Questions

  hooks: Hooks

  constructor(repo: Repository, path: string, engines: string, files: Files, questions: Questions = [], hooks: Hooks = []) {
    this.path = path
    this.repository = repo
    this.engines = engines
    this.files = files
    this.questions = questions
    this.hooks = hooks
  }

  private async compile(resource: Resource): Promise<CompiledFiles> {
    logger.info('compile template')
    const promises = this.files.map(file => file.compile(resource))
    return await Promise.all(promises)
  }

  private async ensureFolder(folders, prefix = ''): Promise<void> {
    const promises = Object.entries(folders)
      .map(async([name, child]) => {
        const dir = join(prefix, name)
        await Effect.fs.ensureDir(dir)
        await this.ensureFolder(child, dir)
      })
    await Promise.all(promises)
  }

  private async ensureDir(files: CompiledFile[]): Promise<void> {
    const folders = {}
    files.forEach(file => {
      const dir = dirname(file.projectPath)
      let parent = folders
      dir.split('/').forEach(name => {
        const pair = name || '/'
        let next = parent[pair]
        if (!next) next = {}

        parent[pair] = next
        parent = next
      })
    })

    await this.ensureFolder(folders)
  }

  public async render(resource: Resource): Promise<void> {
    const files = await this.compile(resource)
    logger.info('rendering')
    await this.ensureDir(files)

    const promises = files.map(file => file.render())
    await Promise.all(promises)
  }

  public async check(resource: Resource, options?: CheckOptions): Promise<void> {
    const files = await this.compile(resource)

    const errors: string[] = []
    const promises = files.map(async file => {
      try {
        await file.check(options)
      } catch (e) {
        errors.push(e.message)
      }
    })

    await Promise.all(promises)

    if (errors.length) {
      errors.forEach(message => logger.error(message))
      throw new Error('Check failed')
    }
  }

  public static async load(repo: Repository): Promise<Template> {
    const cwd = repo.storage
    let entry = join(cwd, 'index.js')

    try {
      const npmConfig = await loadNpmConfig(cwd)
      if (npmConfig.main) entry = join(cwd, npmConfig.main)
    } catch (e) {
    }

    /**
     * NOTE: don't change the object that return by cosmiconfig.
     *       It was cache by cosmiconfig
     */
    const result = await cosmiconfig('template').load(entry)
    if (!result) {
      throw new Error([
        'Cannot load template config',
        `Maybe syntax error in ${entry}`,
      ].join('\n'))
    }

    const config = clone(result.config)

    const valid = validateTemplateConfig(config)

    if (!valid) {
      throw new Error([
        'There is some error in template config: ',
        ajv.errorsText(validateTemplateConfig.errors, { dataVar: 'template' }),
      ].join('\n'))
    }

    /** absoult template path */
    const path = join(cwd, config.path)

    /** generate files */
    const rules = config.rules
      .map(item => ({ ...item, path: join(path, item.path) }))
      .map(item => Rule.format(item))
    const rootRule = new Rule(path, UpgradeType.Cover, true)

    const files = await this.searchDirFile(path, rootRule, rules)

    /** generate questions */
    let questions: Questions = []
    if (config.questions) questions = config.questions.map(question => new Question(question))

    /** generate hooks */
    let hooks: Hook[] = []
    if (config.hooks) {
      hooks = Object.entries(config.hooks)
        .map(([name, listener]) => new Hook(name, listener as (Listener | string)))
    }


    return new Template(repo, path, config.engines, files, questions, hooks)
  }


  private static async searchDirFile(path: string, rule: Rule, rules: Rule[]): Promise<Files> {
    const files = await Effect.fs.readdir(path)
    const promises = files.map(async(filename: string): Promise<File | Files> => {
      const subPath = join(path, filename)

      let subRule = rules.find(rule => rule.match(subPath))

      if (!subRule) subRule = rule
      else subRule = Rule.merge(rule, subRule)

      if (await isDirectory(subPath)) {
        return await this.searchDirFile(subPath, subRule, rules)
      }

      return subRule.createFile(subPath)
    })

    const subFiles = await Promise.all(promises)
    return unnest(subFiles) as Files
  }
}
