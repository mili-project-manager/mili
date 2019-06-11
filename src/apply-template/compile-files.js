const fs = require('fs-extra')
const { extname, basename } = require('path')


const commentator = [
  {
    filenames: [],
    extnames: ['.js', '.ts'],
    create: upgrade => ([
      `// mili upgrade type: ${upgrade}`,
    ].join('\n')),
  },
  {
    filenames: [],
    // extnames: ['.md'],
    extnames: [],
    create: upgrade => ([
      `<!-- mili upgrade type: ${upgrade} -->`,
    ].join('\n')),
  },
  {
    filenames: ['.npmrc'],
    extnames: ['.yml', '.yaml'],
    create: upgrade => ([
      `# mili upgrade type: ${upgrade}`,
    ].join('\n')),
  },
]


function appendFileHeader(file) {
  const ext = extname(file.targetPath)
  const filename = basename(file.targetPath)
  const cm = commentator.find(handler => (
    handler.extnames.includes(ext) || handler.filenames.includes(filename)
  ))

  if (!cm) return file

  if (file.upgrade === 'cover') {
    const comment = cm.create(file.upgrade, 'This file will be cover when upgrade template')
    return { ...file, content: `${comment}\n${file.content}` }
  } else if (file.upgrade === 'merge') {
    const comment = cm.create(file.upgrade, 'This file will be merge when upgrade template')
    return { ...file, content: `${comment}\n${file.content}` }
  }

  return file
}


async function genFile(file) {
  const content = await fs.readFile(file.path, file.encoding)

  file = file.handlers.reduce(
    (file, handler) => handler.genFile(file),
    { ...file, content, targetPath: file.targetPath }
  )

  // NOTE: Handler may remove file
  if (!file.render) return file

  return appendFileHeader(file)
}

module.exports = async function(config) {
  const copyPromises = config.template.files
    .map(file => genFile({ ...file, view: { ...config, custom: {}, answers: config.project.answers } }))

  return await Promise.all(copyPromises)
}