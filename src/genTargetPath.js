const { join, relative } = require('path')

module.exports = (templatePath, root) => file => ({
  ...file,
  targetPath: join(
    root,
    file.handlers.reduce(
      (p, handler) => handler.genPath(p),
      relative(templatePath, file.path)
    )
  ),
})
