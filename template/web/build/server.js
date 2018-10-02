import http from 'http';
import webpackMiddleware from 'koa-webpack';
import chalk from 'chalk';

import vueServerRender from '../server/middleware/vue-server-render';


export default class Server {
  constructor(port, host) {
    this.__renderer = null;
    this.__bundle = null;
    this.__manifest = null;
    this.__template = null;

    // before server code compiled
    this.__requestHandler = (req,res) => {
      res.writeHead(200,{ 'content-type': 'text/plain' });
      res.write('waiting for server code compiled');
      res.end();
    };
    // NOTE: should declare in constructor. Don't need to use .bind(this)
    this.__renderMiddleware = async (ctx, next) => {
      if (this.__renderer) {
        await this.__renderer(ctx, next);
      } else {
        ctx.body = '⌛️ WAITTING FOR COMPLIATION! REFRESH IN A MOMENT';
      }
    };

    this.__hmrMiddleware = null;

    this.__server = http
      .createServer(this.__requestHandler)
      .listen(port,host);

    console.log(chalk.green(`🌏  The server run at ${host}:${port}`));
    console.log(chalk.green('⌛️  Wait for the code to compile...'));
  }

  __genRenderer() {
    const { __manifest, __bundle, __template } = this;

    if (__manifest && __bundle && __template) {
      if (this.__renderer === null) console.log(chalk.green('🍻  Client-side code is compile'))
      this.__renderer = vueServerRender({
        template: __template,
        bundle: __bundle,
        manifest: __manifest,
      });
    }
  }

  set bundle(value) {
    this.__bundle = value;
    this.__genRenderer();
  }

  set manifest(value) {
    this.__manifest = value;
    this.__genRenderer();
  }

  set template(value) {
    this.__template = value;
    this.__genRenderer();
  }

  set devCompiler(value) {
    if (this.__hmrMiddleware) {
      console.log(chalk.red('⚠️ devCompiler should not set again!'));
      return;
    }
    this.__hmrMiddleware = webpackMiddleware({
      compiler: value,
      dev: {
        noInfo: true,
        stats: {
          colors: true,
          chunks: false,
        },
      },
    });
  }

  /**
   * refresh server
   * @param {Object} server Koa Object
   */
  update(server) {
    console.log(chalk.green('Server Updating...'));
    const { __server, __hmrMiddleware, __renderMiddleware, __requestHandler } = this;

    __server.removeListener('request', __requestHandler);
    this.__requestHandler = server
      .use(__hmrMiddleware)
      .use(__renderMiddleware)
      .callback();
    __server.on("request", this.__requestHandler);
    console.log(chalk.green('Server Updated'));
  }
}
