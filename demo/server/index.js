import fs from 'fs';
import { resolve, join } from 'path';
import chalk from 'chalk';
import staticServer from 'koa-static';

import server from './server';
import buildConfig from '../build.config';
import ssr from './middleware/vue-server-render';


const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const clientDir = resolve(__dirname, '../client');

server
  .use(staticServer(resolve(__dirname, '../client')))
  .use(ssr({
    template: fs.readFileSync(join(clientDir, 'template.html'), 'utf8'),
    bundle: join(clientDir, buildConfig.ssrFilename),
    manifest: JSON.parse(fs.readFileSync(join(clientDir, buildConfig.manifestFilename), 'utf8')),
  }))
  .listen(PORT, HOST);

console.log(chalk.green(`🌏  Server Start at ${HOST}:${PORT}`));
