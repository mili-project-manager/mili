import server from './build/webpack.config.server.js'
import client from './build/webpack.config.client.js'
import ssr from './build/webpack.config.ssr.js'

const configs = [server, client, ssr]

export default configs
