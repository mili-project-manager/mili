export default (parent: string, includeParent = false) => (child: string): boolean => {
  if (child === parent) return includeParent
  const parentTokens = parent.split('/').filter(i => i.length)
  const childTokens = child.split('/').filter(i => i.length)
  return parentTokens.every((t, i) => childTokens[i] === t)
}
