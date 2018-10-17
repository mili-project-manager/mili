const fs = require('fs')
const { promisify } = require('util')


const readFile = promisify(fs.readFile)
const access = promisify(fs.access)

exports.readJson = path => access(path, fs.constants.R_OK)
  .then(() => readFile(path))
  .then(content => JSON.parse(content))

exports.flatten = arr => arr.reduce((result, item) => {
  if (Array.isArray(item)) {
    return result.concat(item)
  }
  else return [...result, item]
}, [])
