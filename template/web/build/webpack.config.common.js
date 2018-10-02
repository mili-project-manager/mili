/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import env from 'detect-env';
import webpack from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin'

import config from '../build.config'
import cssLoader from './loaders/css'
import jsLoader from './loaders/js'
import fontLoader from './loaders/font'
import htmlLoader from './loaders/html'
import vueLoader from './loaders/vue'


// base client config
export default {
  context: path.resolve(__dirname, '..'),
  devtool: !env.is.prod && '#cheap-module-source-map',
  mode: env.is.prod ? 'production' : 'development',

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      // BUG: expose-loader not work with config
      // {
      //   test: require.resolve('vuex'),
      //   use: [{
      //     loader: 'expose-loader',
      //     options: 'vuex'
      //   }]
      // },
      vueLoader,
      jsLoader,
      cssLoader,
      fontLoader,
      htmlLoader,
    ],
  },

  resolve: {
    alias: config.alias,
    extensions: ['.js', '.vue'],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
