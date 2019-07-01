import { FileGenerator } from '@/class'
import { unnest } from 'ramda'

const defaultBucketName = Symbol()
interface Item {
  name: string | symbol
  values: string[]
}

type Bucket = Item[]

const classifyIgnore = (list): Bucket => {
  let last: Item = { name: defaultBucketName, values: [] }
  const bucket = [last]

  list.forEach(item => {
    if (/^#/.test(item)) {
      const name = item.substring(1)
      /** comment adjacent comments */
      if (!last.values.length && typeof last.name !== 'symbol') {
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

const mergeBucket = (b1: Bucket, b2: Bucket): Bucket => {
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

const uniqBucket = (b1: Item[], b2: Item[]): Item[] => {
  const allValues = unnest(b2.map(item => item.values))

  return b1.map(pair => {
    const values = pair.values.filter(item => !allValues.includes(item))
    return { name: pair.name, values }
  })
}

const renderBucket = (bucket: Bucket): string => bucket
  .filter(pair => (pair.name !== defaultBucketName || pair.values.length))
  .map(({ name, values }) => {
    let str = ''
    if (typeof name === 'string') str += name.replace(/^(.*)(\n|$)/mg, '#$1\n')
    str += values.join('\n')

    return str
  })
  .join('\n\n')

const mergeIgnore: FileGenerator = async file => {
  const templateIgnoreList = file.content.split('\n')

  const projectContent = await file.getProjectContent()
  const projectIgnoreList = projectContent.split('\n')

  const templateIgnoreBucket = classifyIgnore(templateIgnoreList)
  const projectIgnoreBucket = classifyIgnore(projectIgnoreList)

  const uniquedBucket = uniqBucket(projectIgnoreBucket, templateIgnoreBucket)

  const bucket = mergeBucket(templateIgnoreBucket, uniquedBucket)
  const result = renderBucket(bucket)

  const beginMatched = file.content.match(/^\s*/g)
  const beginBlank = beginMatched ? beginMatched[0] : ''

  const endMatched = file.content.match(/\s*$/g)
  const endBlank = endMatched ? endMatched[0] : ''

  file.content = `${beginBlank}${result}${endBlank}`
}

export default mergeIgnore
