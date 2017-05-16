import path from 'path';

import { VueSSRServerPlugin } from 'vue-ssr-webpack-plugin';
import { dependencies } from '../package.json';
import { base, NON_ISOMORPHIC_NODE_MODULES, NON_JS_NODE_MODULES } from './webpack.config.base';


export const ssrFileName = 'vue-ssr-bundle.json';

function emptyPackage(list) {
  return Object.keys(list).reduce((emptyList, alias) => ({
    ...emptyList,
    [alias]: path.resolve(__dirname, 'empty'),
  }), {});
}

function getExternals() {
  return Object.keys(dependencies).filter(key => (
    !NON_JS_NODE_MODULES.includes(key)
  ));
}

export default {
  ...base,
  devtool: 'source-map',
  target: 'node',

  externals: getExternals(),

  output: {
    ...base.output,
    libraryTarget: 'commonjs2',
  },

  resolve: {
    ...base.resolve,
    alias: {
      ...base.resolve.alias,
      ...emptyPackage(NON_ISOMORPHIC_NODE_MODULES),
    },
  },

  plugins: [
    ...base.plugins,
    new VueSSRServerPlugin(),
  ],
};
