import { FileGenerator, Handler } from '@/class'

export default function(name, begin, end = begin): Handler {
  const genFile: FileGenerator = async file => {
    if (!file.projectFileExisted) return
    const projectContent = await file.getProjectContent()

    let beginIndex = projectContent.indexOf(begin)
    if (beginIndex === -1) return

    beginIndex += begin.length
    const endIndex = projectContent.indexOf(end, beginIndex)

    if (endIndex === -1) return

    file.addition[name] = projectContent.substring(beginIndex, endIndex)
  }

  return new Handler(genFile)
}
