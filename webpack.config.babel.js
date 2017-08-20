import server from './build/webpack.config.server.js';
import client from './build/webpack.config.client.js';
import ssr from './build/webpack.config.ssr.js';


export default [server, ssr, client];
// export default [ssr, client];
// export default client;

