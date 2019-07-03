import { TEMPLATE_STORAGE } from '@/consts/path'
import { Effect, EffectOptions } from '@/internal'

interface CleanOptions {
  effect?: EffectOptions
}

export default async(options: CleanOptions = {}) => {
  Effect.replace(options.effect)

  await Effect.fs.remove(TEMPLATE_STORAGE)
}
