import fs from 'fs-extra'
import { TEMPLATE_STORAGE } from '@/consts/path'


export default async() => {
  await fs.remove(TEMPLATE_STORAGE)
}
