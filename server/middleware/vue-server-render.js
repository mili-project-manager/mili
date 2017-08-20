import fs from 'fs';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';


function renderToString(renderer, url) {

  return new Promise((resolve, reject) => {
    renderer.renderToString({ url }, (err, html) => {
      if (err) reject(err);
      resolve(html ? html : '');
    });
  });
}

export default function ({ bundle, manifest: clientManifest }) {
  const template = fs.readFileSync('./client/index.html', 'utf8');

  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest,
  });

  return async (ctx, next) => {
    const html = await renderToString(renderer, ctx.url);
    ctx.body = html;
  };
}

