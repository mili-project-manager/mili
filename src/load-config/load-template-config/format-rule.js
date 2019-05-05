const handlers = require('../../handlers')
const log = require('../../utils/log')


module.exports = rule => {
  if (!rule.handlers && rule.handler) rule.handlers = [rule.handler]
  else if (!rule.handlers) rule.handlers = []


  const effectiveHandlers = []

  rule.handlers.forEach(handler => {
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
      `path: ${rule.path}`,
    ].join('\n'))
  })

  if (rule.upgrade === 'merge') effectiveHandlers.push(handlers.merge)
  if (rule.upgrade === 'exist') effectiveHandlers.push(handlers.exist)

  return { ...rule, handlers: effectiveHandlers }
}
