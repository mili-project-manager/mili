const { readFileSync, accessSync } = require('fs')


module.exports = file => {
  if (file.targetFile) return file

  try {
    accessSync(targetFile, F_OK)
  } catch(e) {
    return { ...file, targetFile: { exist: false } }
  }

  const content = readFileSync(file.targetPath, file.encoding)
  return {
    ...file,
    targetFile: {
      exist: true,
      content,
    },
  }
}
