import server from './build/webpack.config.server.js';
import client from './build/webpack.config.client.js';
import ssr from './build/webpack.config.ssr.js';
import analyzer from './build/webpack.config.analyzer.js';

const configs = [];


if (process.env.COMPILE_ENV === 'analyzer') {
  configs.push(analyzer);
} else {
  configs.push(server);
  configs.push(client);
  configs.push(ssr);
}

export default configs;
