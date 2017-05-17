import { createBundleRenderer } from 'vue-server-renderer';
import HTML_FILE_NAME from 'contants/html-file-name';

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
    const html = await renderToString(renderer, ctx.url);
    await ctx.render(HTML_FILE_NAME, { app: html });
  };
}
