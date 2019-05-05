const identify = a => a

module.exports = (genFile, genPath = identify) => ({
  genFile,
  genPath,
  mili_type: 'handler',
})
