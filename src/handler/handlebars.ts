import * as fs from 'fs-extra'
import { Compile } from '@/interface/handler'
import * as path from 'path'
import * as Handlebars from 'handlebars'
import * as R from 'ramda'


Handlebars.registerHelper('isEmpty', function(value) {
  return R.isEmpty(value)
})

Handlebars.registerHelper('equals', function(lvalue, rvalue) {
  return R.equals(lvalue, rvalue)
})

export const compile: Compile = async function(dist, src, filepath, resource, options) {
  const encoding = options.encoding
  const srcfilepath = path.join(src, filepath)
  filepath = filepath.replace(/\.(hbs|handlebars)$/, '')

  const source = await fs.readFile(srcfilepath, { encoding })

  const template = Handlebars.compile(source)


  const view = R.fromPairs(Array.from(resource.entries()))
  const result = template(view)

  await fs.writeFile(path.join(src, filepath), result)

  return filepath
}
