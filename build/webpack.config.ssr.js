import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import nodeExternals from 'webpack-node-externals';
import { VueSSRServerPlugin } from 'vue-ssr-webpack-plugin';

import base from './webpack.config.base';
import config from './config';
import { SSR } from './constant/webContainer';


function emptyPackage(list) {
  return Object.keys(list).reduce((emptyList, alias) => ({
    ...emptyList,
    [alias]: path.resolve(__dirname, 'empty'),
  }), {});
}

export default merge(base, {
  entry: ['babel-polyfill', './client/entry-ssr'],
  target: 'node',
  externals: nodeExternals({ whitelist: /\.css$/ }),
  output: { libraryTarget: 'commonjs2' },

  resolve: {
    alias: { ...emptyPackage(config.nonIsomorphicModule) },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.CONTAINER': JSON.stringify('ssr'),
    }),

    new VueSSRServerPlugin({
      filename: config.ssrFilename,
    }),
  ],
});
