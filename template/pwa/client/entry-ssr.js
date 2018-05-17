// Server Side Render Bundle entry file
import createApp from './createApp'


export default async ctx => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    router.push(ctx.url)
    router.onReady(() => resolve(app))
  })
}
