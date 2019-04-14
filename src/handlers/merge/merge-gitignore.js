module.exports = file => {
  const ignoreList = file.content.split('\n')
  const projectIgnoreList = file.targetFile.content.split('\n')


  let mergedList = []
  let lastIgnoreListIndex = 0
  let lastProjectIgnoreListIndex = 0

  ignoreList.forEach((item, index) => {

    let i = projectIgnoreList
      .slice(lastProjectIgnoreListIndex)
      .findIndex(value => value === item)
    i = i === -1 ? -1 : i + lastProjectIgnoreListIndex

    if (i !== -1 && lastProjectIgnoreListIndex < i) {
      mergedList.push(...ignoreList.slice(lastIgnoreListIndex, index))

      const lastProjectListFragment = projectIgnoreList
        .slice(lastProjectIgnoreListIndex, i)
        .filter(item => !ignoreList.includes(item) && item.length)
      mergedList.push(...lastProjectListFragment)

      lastIgnoreListIndex = index
      lastProjectIgnoreListIndex = i
    } else if (index === ignoreList.length - 1) {
      mergedList.push(...ignoreList.slice(lastIgnoreListIndex))
      const lastProjectListFragment = projectIgnoreList
        .slice(lastProjectIgnoreListIndex)
        .filter(item => !ignoreList.includes(item) && item.length)
      mergedList.push(...lastProjectListFragment)
    }
  })

  if (lastIgnoreListIndex < projectIgnoreList.length) {
    const lastProjectListFragment = projectIgnoreList
      .slice(lastProjectIgnoreListIndex, projectIgnoreList.length)
      .filter(item => !ignoreList.includes(item) && item.length)
    mergedList.push(...lastProjectListFragment)
  }

  mergedList = mergedList.reduce((list, item) => {
    if (!item.length || !list.includes(item)) list.push(item)
    return list
  }, [])


  return {
    ...file,
    content: mergedList.join('\n'),
  }
}
