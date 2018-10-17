#!/usr/bin/env node

const chalk = require('chalk')


exports.error = (type, string, ...arg) =>
  console.log(chalk.red(`[mili ${type} error] ${string}`), ...arg)

exports.info = string =>
  console.log(chalk.green(`[mili info] ${string}`))

exports.warn = (type, string, ...arg) =>
  console.log(chalk.yellow(`[mili warn] ${string}`), ...arg)

