import Ajv from 'ajv'
import glob from 'micromatch'
import { UpgradeType, Encoding, InferEncodingFunc } from '@/consts'
import { RuleSchema, HandlerSchema } from '@/schema'
import { inferEncodingByMapping, inferEncodingImmobile, inferEncodingNormally } from '@/infer-encoding'
import { Handler, Handlers, File, buildInHandlers, Maybe } from '@/internal'
import { isAbsolute } from 'path'


const ajv = new Ajv({ useDefaults: true })
const validate = ajv
  .addSchema([HandlerSchema])
  .compile(RuleSchema)

export class Rule {
  readonly path: string
  readonly upgrade: UpgradeType
  readonly glob: boolean
  readonly handler?: Handler
  readonly inferEncoding: InferEncodingFunc

  constructor(
    path: string,
    upgrade: UpgradeType = UpgradeType.Cover,
    glob = true,
    inferEncoding: InferEncodingFunc = inferEncodingNormally,
    handler?: Handler,
  ) {
    this.path = path
    this.inferEncoding = inferEncoding
    this.upgrade = upgrade
    this.glob = glob
    this.handler = handler
  }

  public static format(obj): Rule {
    const valid = validate(obj)

    if (!valid) {
      throw new TypeError([
        'Incorrect rules field configuration for template configuration',
        ajv.errorsText(validate.errors, { dataVar: 'rule' }),
      ].join('\n'))
    }

    if (!isAbsolute(obj.path)) throw new TypeError(`The path of rule should be absolute path. But get ${obj.path}`)

    const path = obj.path
    const upgrade = obj.upgrade
    const glob = obj.glob
    let inferEncoding: InferEncodingFunc = inferEncodingNormally
    if ('encoding' in obj) {
      if (typeof obj.encoding === 'object') {
        inferEncoding = inferEncodingByMapping(obj.encoding)
      } else if (Object.values(Encoding).includes(obj.encoding)) {
        inferEncoding = inferEncodingImmobile(obj.encoding)
      }
    }
    let handler

    if (obj.handlers) {
      const handlers = obj.handlers.map(Handler.format)
      handler = Handler.compose(handlers)
    } else if (obj.handler) {
      handler = Handler.format(obj.handler)
    }

    return new Rule(path, upgrade, glob, inferEncoding, handler)
  }

  public match(path: string): boolean {
    if (this.glob) return glob.isMatch(path, this.path)
    return this.path === path
  }

  public static merge(parent: Rule, child: Rule): Rule {
    const path = child.path
    const upgrade = child.upgrade
    const glob = child.glob
    const handlers: Handlers = []
    let handler: Maybe<Handler>

    if (parent.handler) handlers.push(parent.handler)
    if (child.handler) handlers.push(child.handler)

    if (handlers.length) handler = Handler.compose(handlers)
    const inferEncoding = child.inferEncoding || parent.inferEncoding

    return new Rule(path, upgrade, glob, inferEncoding, handler)
  }

  public createFile(path: string): File {
    const paths = path.split('/')
      .map((pair, i, arr) => arr.slice(0, arr.length - i).join('/'))
      .filter(item => Boolean(item))

    if (!paths.some(item => this.match(item))) {
      throw new Error([
        'Cannot create file from rule',
        'Because the file path is not match rule',
      ].join('\n'))
    }

    const { inferEncoding, upgrade } = this
    let handler: Maybe<Handler> = this.handler
    let upgradeHandler: Maybe<Handler>

    if (upgrade === 'merge') upgradeHandler = buildInHandlers.merge
    if (upgrade === 'exist') upgradeHandler = buildInHandlers.exist
    if (upgrade === 'keep') upgradeHandler = buildInHandlers.ignoreWhen(({ operation }) => operation !== 'init')

    if (handler && upgradeHandler) handler = Handler.compose([handler, upgradeHandler])
    else if (!handler && upgradeHandler) handler = upgradeHandler


    return new File(path, inferEncoding, handler)
  }
}
