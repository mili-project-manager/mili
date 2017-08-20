import webpackMiddleware from 'koa-webpack';
import chalk from 'chalk';

import vueServerRender from '../server/middleware/vue-server-render';


let renderer = null;
let bundle = null;
let manifest = null;

export const setBundle = (value) => {
  bundle = value;
  if (manifest) {
    renderer = vueServerRender({ bundle, manifest });
  }
};

export const setManifest = (value) => {
  manifest = value;

  if (bundle) {
    renderer = vueServerRender({ bundle, manifest });
  }
};

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

let runningServer = null;

const shutdown = async (server) => {
  return new Promise((resolve, reject) => {
    server.shutdown(() => {
      console.log('server close');
      resolve();
    });
  });
};

export const createServer = async (server, devCompiler) => {
  if (runningServer) await shutdown(runningServer);

  let closeCb = null;
  runningServer = server
    .use(webpackMiddleware({
      compiler: devCompiler,
      dev: {
        // publicPath: devCompiler.options.output.publicPath,
        stats: {
          colors: true,
          chunks: false,
        },
      },
    }))
    .use(async (ctx, next) => {
      if (renderer === null) {
        ctx.body = '⌛️ WAITTING FOR COMPLIATION! REFRESH IN A MOMENT';
      } else {
        await next();
      }
    })
    .use(async (ctx, next) => {
      await renderer(ctx, next);
    })
    .listen(PORT, HOST, () => {
      if (closeCb) {
        runningServer.close();
        closeCb();
      } else {
        runningServer.shutdown = (cb) => {
          runningServer.close();
          cb();
        }
      }
    });

  runningServer.shutdown = (cb) => closeCb = cb;

  console.log(chalk.green(`🌏  The server run at ${HOST}:${PORT}`));
  if (renderer === null) {
    console.log(chalk.green('⌛️  Wait for the client-side code to compile...'));
  }
}


// Compatible with MemoryFileSystem
export const readFile = (fs, file) => {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (e) {
    console.log(`readFileError:(${file}) ${e.message}`);
  }
}
