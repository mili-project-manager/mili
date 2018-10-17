#!/usr/bin/env node
const cosmiconfig = require('cosmiconfig')
const fs = require('fs')
const { promisify } = require('util')
const git = require('simple-git/promise')
const { join } = require('path')
const throwError = require('./throwError')
const paths = require('./paths')
const sa = require('sanitization')
const semver = require('semver')


// const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
// const writeFile = promisify(fs.writeFile)
// const stat = promisify(fs.stat)
const access = promisify(fs.access)
// const mkdir = promisify(fs.mkdir)

const readJson = path => readFile(path)
  .then(content => JSON.parse(content))


const loadPackageJson = async templatePath => {
  const path = join(templatePath, 'package.json')

  try {
    await access(path, fs.constants.R_OK)
    return readJson(path)
  } catch(err) {
    throwError('Failed to load template package.json file,')
  }
}

const loadEntryFile = async entryPath => {
  try {
    const result =  await cosmiconfig('template').load(entryPath)
    return result.config
  } catch(err) {
    throwError(`Failed to load template entry file: ${err.message}`)
  }
}

const checkConfig = sa.keys({
  path: sa.string.required,
  encoding: sa.string.defaulted('utf8'),
  engines: sa.string.required,
  rules: sa.each({
    path: sa.string.required,
    upgrade: sa.valid(['cover', 'keep', 'merge']),
    handler: sa.any,
    handlers: sa.array,
  }),
})

module.exports = async templatePath => {
  const packageJson = await loadPackageJson(templatePath)

  if (!semver.valid(packageJson.version)) throwError('The version number of the template does not conform to the semver specification')

  const entryPath = join(templatePath, packageJson.main)

  const config = await loadEntryFile(entryPath)

  try {
    checkConfig(config)
  } catch(e) {
    throwError('Template configuration error')
  }

  config.rules = config.rules
    .map(rule => {
      rule.path = join(templatePath, config.path, rule.path)
      if (rule.handlers) rule.handlers = rule.handlers
      else if (rule.handler) rule.handlers = [rule.handler]
      else rule.handlers = []
      return rule
    })

  return { ...config, version: packageJson.version }
}
