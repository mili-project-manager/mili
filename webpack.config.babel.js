import server from './webpack/webpack.config.server.js';
import client from './webpack/webpack.config.client.js';
import ssr from './webpack/webpack.config.ssr.js';


export default [server, ssr, client];
