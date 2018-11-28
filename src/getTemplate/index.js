const clone = require('./clone')


module.exports = async (path, storage, version) => {
  if (/^[.|/]/.test(path)) return () => {}
  else return clone(path, version, storage)
}
