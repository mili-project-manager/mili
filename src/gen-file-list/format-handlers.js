const handlers = require('../handlers')
const log = require('../log')


module.exports = file => {
  const effectiveHandlers = []

  file.handlers.forEach(handler => {
    if (typeof handler === 'string' && (handler in handlers)) return effectiveHandlers.push(handlers[handler])
    if (typeof handler === 'function') {
      const h = handler(handlers)
      if (h.mili_type === 'handler') return effectiveHandlers.push(h)
    }

    log.error('handler', [
      'File processing uses an unrecognized handler.',
      'This handler will be ignored, which may result in the final generated file not matching the expected',
      'Please confirm if the loaded template supports the current mili version,',
      'and feedback this question to the template developer.',
      'The current file will be overwritten directly by the template file.',
      `path: ${file.path}`
    ].join('\n'))

  })

  if (file.upgrade === 'merge') effectiveHandlers.push(handlers.merge)
  if (file.upgrade === 'exist') effectiveHandlers.push(handlers.exist)
  return { ...file, handlers: effectiveHandlers }
}
