const { version } = require('../../package.json')


module.exports = async() => {
  const config = { version }

  return config
}
