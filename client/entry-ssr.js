// Server Side Render Bundle entry file
import createApp from './createApp';


async function loadComponentsAsyncData({ components, stroe, router }) {
  return Promise.all(components.map(component => {
    if (!component.initData) {
      return component.initData({store, router})
    }
  }));
}

export default async ctx => {
  const { app, router, store } = createApp();

  router.push(ctx.url);

  return new Promise((resolve, reject) => {
    router
      .onReady(() => {
        const matchedComponents = router.getMatchedComponents();

        if (!matchedComponents.length) {
          return reject({ code: 404  })
        }

        loadComponentsAsyncData({ store, router, components: matchedComponents })
          .then(resolve(app))
          .catch(reject);
      }, reject);
  })
}
