module.exports = parent => child => {
  if (child === parent) return false
  const parentTokens = parent.split('/').filter(i => i.length)
  const childTokens = child.split('/').filter(i => i.length)
  return parentTokens.every((t, i) => childTokens[i] === t)
}
