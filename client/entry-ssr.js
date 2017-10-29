// Server Side Render Bundle entry file
import createApp from './createApp';


async function loadComponentsInitialData({ components, store, router }) {
  return Promise.all(components.map(component => {
    if (component.initialData) {
      return component.initialData({store, route: router.currentRoute })
    }
  }));
}

export default async ctx => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(ctx.url);
    router
      .onReady(() => {
        const matchedComponents = router.getMatchedComponents();

        if (!matchedComponents.length) return reject({ code: 404  });

        loadComponentsInitialData({ store, router, components: matchedComponents })
          .then(() => ctx.state = store.state)
          .then(() => resolve(app))
          .catch(reject);
      }, reject);
  })
}

