import path from 'path';

import Koa from 'koa';
import csp from 'koa-csp';
import views from 'koa-views';
import proxy from 'koa-proxy';
import logger from 'koa-logger';
import convert from 'koa-convert';

// middleware config
import * as config from './config';

// import router from './routes';

const server = new Koa();

server
  .use(logger())
  .use(csp(config.csp))
  .use(views(path.resolve(__dirname, '../views'), { map: { html: 'ejs' } }))
  .use(convert(proxy(config.proxy)));
  // .use(router.routes());
  // .use(staticServer('./client'));

export default server;
