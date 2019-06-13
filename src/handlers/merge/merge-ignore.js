const defaultBucketName = Symbol()
const classifyIgnore = list => {
  let last = { name: defaultBucketName, values: [] }
  const bucket = [last]

  list.forEach(item => {
    if (/^#/.test(item)) {
      const name = item.substring(1)
      /** comment adjacent comments */
      if (!last.values.length && last.name !== defaultBucketName) {
        last.name = `${last.name}\n${name}`
        return
      }

      const pair = bucket.find(item => item.name === name)
      if (pair) {
        last = pair
      } else {
        last = { name, values: [] }
        bucket.push(last)
      }
    } else if (item) {
      if (!last.values.includes(item)) last.values.push(item)
    }
  })

  return bucket
}

const mergeBucket = (b1, b2) => {
  const bucket = b1.map(item => ({ ...item }))

  b2.forEach(pair => {
    const sameOne = bucket.find(item => item.name === pair.name)
    if (!sameOne) {
      bucket.push(pair)
    } else {
      pair.values.forEach(value => {
        if (!(sameOne.values.includes(value))) sameOne.values = sameOne.values.concat(value)
      })
    }
  })

  return bucket
}

const uniqBucket = (b1, b2) => {
  const allValues = [].concat(...b2.map(item => item.values))
  return b1.map(pair => {
    const values = pair.values.filter(item => !allValues.includes(item))
    return { name: pair.name, values }
  })
}

const renderBucket = bucket => bucket
  .filter(pair => (pair.name !== defaultBucketName || pair.values.length))
  .map(({ name, values }) => {
    let str = ''
    if (typeof name === 'string') str += name.replace(/^(.*)(\n|$)/mg, '#$1\n')
    str += values.join('\n')

    return str
  })
  .join('\n\n')

module.exports = file => {
  const templateIgnoreList = file.content.split('\n')
  const projectIgnoreList = file.targetFile.content.split('\n')

  const templateIgnoreBucket = classifyIgnore(templateIgnoreList)
  const projectIgnoreBucket = classifyIgnore(projectIgnoreList)

  const uniquedBucket = uniqBucket(projectIgnoreBucket, templateIgnoreBucket)

  const bucket = mergeBucket(templateIgnoreBucket, uniquedBucket)
  const result = renderBucket(bucket)

  const beginBlank = file.content.match(/^\s*/g)[0]
  const endBlank = file.content.match(/\s*$/g)[0]

  return {
    ...file,
    content: `${beginBlank}${result}${endBlank}`,
  }
}
