module.exports = message => {
  throw new Error([
    message,
    'please confirm if the loaded template supports the current mili version,',
    'and feedback this question to the template developer.',
  ].join('\n'))
}
