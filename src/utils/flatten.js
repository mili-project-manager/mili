module.exports = arr => arr.reduce((result, item) => {
  if (Array.isArray(item)) {
    return result.concat(item)
  }
  else return [...result, item]
}, [])
