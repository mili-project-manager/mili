import { createBundleRenderer } from 'vue-server-renderer';

function renderToString(renderer, url) {
  return new Promise((res, rej) => {
    renderer.renderToString({ url }, (err, html) => {
      if (err) rej(err);
      res(html ? html : '');
    });
  });
}

export default function (bundle) {
  const renderer = createBundleRenderer(bundle);

  return async (ctx, next) => {
    console.log('aaaaa');
    console.log(renderer);
    const html = await renderToString(renderer, ctx.url);
    await ctx.render('index.dev.html', { app: html });
  };
}
