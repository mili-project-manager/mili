import { Handler, FileGenerator } from '@/class'

const genFile: FileGenerator = async file => {
  file.renderable = !file.projectFileExisted
}

export default new Handler(genFile)
