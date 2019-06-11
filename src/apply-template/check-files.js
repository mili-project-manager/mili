const fs = require('fs-extra')
const throwError = require('../utils/throw-error')
const jsDiff = require('diff')
const chalk = require('chalk')


const isNull = value => value === null
const createLineNumberFormater = (maxOldLineNumberLength, maxNewLineNumberLength) => (oldNumber, newNumber) => {
  const oldNumberStr = isNull(oldNumber) ? ' ' : String(oldNumber)
  const newNumberStr = isNull(newNumber) ? ' ' : String(newNumber)

  const oldN = oldNumberStr.padEnd(maxOldLineNumberLength, ' ')
  const newN = newNumberStr.padEnd(maxNewLineNumberLength, ' ')

  return `${oldN}|${newN} `
}

const createLineFormater = (maxOldLineNumber, maxNewLineNumber) => {
  const maxOldLineNumberLength = String(maxOldLineNumber).length
  const maxNewLineNumberLength = String(maxNewLineNumber).length
  const formatLineNumber = createLineNumberFormater(maxOldLineNumberLength, maxNewLineNumberLength)

  return (oldNumber, newNumber, tag, str, fold = false) => {
    const lines = str.match(/((.*\n)|(.+$))/g)
      .map((line, i) => {
        const oldNumberWithOffset = oldNumber && oldNumber + i
        const newNumberWithOffset = newNumber && newNumber + i
        const lineNumber = formatLineNumber(oldNumberWithOffset, newNumberWithOffset)
        return `${lineNumber} ${tag} ${line.replace(/(\n$)/, '')}\n`
      })

    if (fold && lines.length > 2) {
      const dot = '...\n'.padStart(maxOldLineNumberLength + 3, ' ')
      lines.splice(1, lines.length - 2, dot)
    }

    return lines.join('')
  }
}

const createEndLineValider = diffPairs => {
  const index = [...diffPairs].reverse().findIndex(item => !item.added && !item.removed)
  const count = diffPairs.length - 1
  const lastSamePairIndex = index >= 0 ? count - index : index

  return i => {
    if (lastSamePairIndex < i) return true
    else if (lastSamePairIndex === diffPairs.length - 1 && lastSamePairIndex === i) return true
    return false
  }
}


function showDiff(filename, oldContent, newContent, options = {}) {
  let str = ''
  let oldLineNumber = 1
  let newLineNumber = 1
  const maxOldLineNumber = oldContent.split('\n').length
  const maxNewLineNumber = oldContent.split('\n').length
  const formatLine = createLineFormater(maxOldLineNumber, maxNewLineNumber)

  const diffPairs = jsDiff.diffLines(oldContent, newContent)
  const isEndLine = createEndLineValider(diffPairs)


  diffPairs.forEach(({ added, removed, value }, i) => {
    const needFillEndLine = isEndLine(i)

    const inc = value.split('\n').length - 1

    if (added) {
      const strWithoutColor = formatLine(null, newLineNumber, '+', value)

      str += chalk.green(strWithoutColor)
      newLineNumber += inc
    } else if (removed) {
      const strWithoutColor = formatLine(oldLineNumber, null, '-', value)

      str += chalk.red(strWithoutColor)
      oldLineNumber += inc
    } else {
      const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', value, options.fold)
      str += chalk.grey(strWithoutColor)

      newLineNumber += inc
      oldLineNumber += inc
    }

    /**
     * Add an empty line,
     * if '\n' at the end of file.
     * So, It's easy to tell if the last line end with '\n'
     */
    if (needFillEndLine && /\n$/.test(value)) {
      if (added) {
        const strWithoutColor = formatLine(null, newLineNumber, '+', '\n')
        str += chalk.green(strWithoutColor)
        newLineNumber += 1
      } else if (removed) {
        const strWithoutColor = formatLine(oldLineNumber, null, '-', '\n')
        str += chalk.red(strWithoutColor)
        oldLineNumber += 1
      } else {
        const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', '\n')
        str += chalk.grey(strWithoutColor)
        newLineNumber += 1
        oldLineNumber += 1
      }
    }
  })

  const headerLength = filename.length + 4

  console.log('\n')
  console.log(chalk.yellow([
    Array(headerLength).fill('=').join(''),
    `  ${filename}  `,
    Array(headerLength).fill('-').join(''),
  ].join('\n')))

  console.log(str)
  console.log(chalk.yellow(Array(headerLength).fill('=').join('')))
  console.log('\n')
}


async function isSafety(file, isShowDiff, isFoldCode) {
  let content

  if (!file.targetFile) {
    try {
      await fs.access(file.targetPath, fs.constants.F_OK)
    } catch (e) {
      console.log(chalk.magenta(`${file.targetPath}: not exist`))
      return false
    }

    content = await fs.readFile(file.targetPath, file.encoding)
  } else if (!file.targetFile.exist) {
    console.log(chalk.magenta(`${file.targetPath}: not exist`))
    return false
  } else {
    content = file.targetFile.content
  }

  if (content !== file.content) {
    if (isShowDiff) showDiff(file.targetPath, content, file.content, { fold: isFoldCode })
    else console.log(chalk.magenta(`${file.targetPath}: Not match template.`))
    return false
  }
}

module.exports = async function(files, isShowDiff, isFoldCode) {
  const promises = files.map(file => isSafety(file, isShowDiff, isFoldCode))
  const results = await Promise.all(promises)
  if (results.includes(false)) throwError('Run `npx mili update` to fix it')
}
