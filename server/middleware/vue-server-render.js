import fs from 'fs';
import { createBundleRenderer } from 'vue-server-renderer';


const title = 'Vue-Koa Boilerplate';
function renderToString(renderer, url) {

  return new Promise((resolve, reject) => {
    renderer.renderToString({ url, title }, (err, html) => {
      if (err) {
        const kerr = new Error(err.message || 'vue-server-render error');
        kerr.status = err.code;
        kerr.expose = !env.isProd;
        reject(kerr);
        return;
      }

      resolve(html);
    });
  });
}

export default function ({ bundle, template, manifest: clientManifest }) {
  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest,
  });

  return async (ctx, next) => {
    let html = false;

    try {
      html = await renderToString(renderer, ctx.url);
    } catch (err) {
      if (err.status !== 404) throw err;
    }

    if (html) ctx.body = html;
    else await next();
  };
}
