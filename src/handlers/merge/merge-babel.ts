import { FileGenerator } from '@/internal'
import { mergeAll, union, mergeDeepWith } from 'ramda'

const merge = (a: any, b: any): any => {
  if (Array.isArray(a) && Array.isArray(b)) return union(a, b)
  return b
}
const mergeDeepWithUnionArray = mergeDeepWith(merge)

class Plugin {
  public name: string

  public option: object


  get content(): (string | [string, object]) {
    if (Object.keys(this.option).length) return [this.name, this.option]
    return this.name
  }

  constructor(item) {
    this.name = Array.isArray(item) ? item[0] : item
    if (Array.isArray(item) && typeof item[1] === 'object') this.option = item[1]
    else this.option = {}
  }

  public equal(plugin: Plugin): boolean {
    return this.name === plugin.name || this.name.includes(plugin.name)
  }

  public merge(plugin): Plugin {
    const option = mergeDeepWithUnionArray(this.option, plugin.option)
    return new Plugin([this.name, option])
  }
}


function mergeArray(source = [], overrides = []): Plugin[] {
  const reduction: Plugin[] = []
  const plugins = [...source, ...overrides]
    .map(item => new Plugin(item))

  plugins.forEach(plugin => {
    const index = reduction.findIndex(item => plugin.equal(item))
    if (index !== -1) reduction[index] = plugin.merge(reduction[index])
    else reduction.push(plugin)
  })

  return reduction
}

function babelMerge(source: any = {}, overrides: any = {}): object {
  const plugins = mergeArray(source.plugins, overrides.plugins)
  const presets = mergeArray(source.presets, overrides.presets)

  const sourceEnv = source.env || {}
  const overridesEnv = overrides.env || {}
  const envs = union(Object.keys(sourceEnv), Object.keys(overridesEnv))
    .map(name => ({
      [name]: babelMerge(sourceEnv[name], overridesEnv[name]),
    }))

  const result: any = {}
  if (presets.length) result.presets = presets.map(plugin => plugin.content)
  if (plugins.length) result.plugins = plugins.map(plugin => plugin.content)
  if (envs.length) result.env = mergeAll(envs)
  return result
}

const mergeBabelrc: FileGenerator = async file => {
  let { content } = file

  const beginMatched = content.match(/^\s*/g)
  const beginBlank = beginMatched ? beginMatched[0] : ''

  const endMatched = content.match(/\s*$/g)
  const endBlank = endMatched ? endMatched[0] : ''
  let result: string

  try {
    content = JSON.parse(file.content)
  } catch (e) {
    throw new Error([
      'The template file and the current file failed to merge due to a json syntax error in the template file.',
      'The current file will be overwritten directly by the template file.',
      `path: ${file.templatePath}`,
    ].join('\n'))
  }

  if (file.projectFileExisted) {
    let projectContent = await file.getProjectContent()

    try {
      projectContent = JSON.parse(projectContent)
    } catch (e) {
      throw new Error([
        'The template file and the current file failed to merge due to a json syntax error in the current file.',
        'The current file will be overwritten directly by the template file.',
        `path: ${file.projectPath}`,
      ].join('\n'))
    }

    result = JSON.stringify(babelMerge(projectContent, content), null, '  ')
  } else {
    result = JSON.stringify(babelMerge(content, {}), null, '  ')
  }

  file.content = `${beginBlank}${result}${endBlank}`
}

export default mergeBabelrc
