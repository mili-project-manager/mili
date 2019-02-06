module.exports = message => {
  throw new Error([
    message,
    'If this is an error caused by the template, please feedback this question to template developer.',
  ].join('\n'))
}
