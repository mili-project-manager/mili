const fs = require('fs')


module.exports = file => {
  if (file.targetFile) return file

  try {
    fs.accessSync(file.targetPath, fs.constants.F_OK)
  } catch(e) {
    console.log('exist', e)
    return { ...file, targetFile: { exist: false } }
  }

  const content = fs.readFileSync(file.targetPath, file.encoding)
  return {
    ...file,
    targetFile: {
      exist: true,
      content,
    },
  }
}
