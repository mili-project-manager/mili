const fs = require('fs')
const { promisify } = require('util')
const { join, dirname } = require('path')


const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)



module.exports = async ({ path, view , handlers, encoding, targetPath }, root) => {

  // 提前做
  // await ensureDirectoryExistence(targetPath)
  const content = await readFile(path, encoding)
  file = handlers.reduce(
    (file, handler) => handler.genFile(file),
    { path, view, content, encoding, targetPath }
  )

  await writeFile(targetPath, file.content, encoding)
}
