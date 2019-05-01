const fs = require('fs-extra')
const { join } = require('path')
const { extname, basename } = require('path')

const commentator = [
  {
    filenames: [],
    extnames: ['.js', '.ts'],
    create: upgrade => [`// mili upgrade type: ${upgrade}`].join('\n'),
  },
  {
    filenames: [],
    // extnames: ['.md'],
    extnames: [],
    create: upgrade => [`<!-- mili upgrade type: ${upgrade} -->`].join('\n'),
  },
  {
    filenames: ['.npmrc'],
    extnames: ['.yml', '.yaml'],
    create: upgrade => [`# mili upgrade type: ${upgrade}`].join('\n'),
  },
]

const appendFileHeader = file => {
  const ext = extname(file.targetPath)
  const filename = basename(file.targetPath)
  const cm = commentator.find(
    handler =>
      handler.extnames.includes(ext) || handler.filenames.includes(filename)
  )

  if (!cm) return file

  if (file.upgrade === 'cover') {
    const comment = cm.create(
      file.upgrade,
      'This file will be cover when upgrade template'
    )
    return { ...file, content: `${comment}\n${file.content}` }
  } else if (file.upgrade === 'merge') {
    const comment = cm.create(
      file.upgrade,
      'This file will be merge when upgrade template'
    )
    return { ...file, content: `${comment}\n${file.content}` }
  }

  return file
}

const copy = async file => {
  const content = await fs.readFile(file.path, file.encoding)

  file = file.handlers.reduce((file, handler) => handler.genFile(file), {
    ...file,
    content,
    targetPath: file.targetPath,
  })

  file = appendFileHeader(file)

  await fs.writeFile(file.targetPath, file.content, file.encoding)
}

module.exports = async config => {
  for (let file of config.template.files) {
    await copy({ ...file, view: { ...config, custom: {} } })
  }
}
