import path from 'path';
import webpack from 'webpack';
import env from 'detect-env';
import merge from 'webpack-merge';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import config from './config';
import common from './webpack.config.common';


const plugins = [
  // new webpack.optimize.CommonsChunkPlugin({
  //   names: 'lib',
  //   filename: '[name].[chunkhash:8].js',
  // }),

  // new webpack.optimize.CommonsChunkPlugin({
  //   name: "manifest",
  // }),

  new VueSSRClientPlugin({
    filename: config.manifestFilename,
  }),

  new webpack.DefinePlugin({
    'process.env.WEB_CONTAINER': JSON.stringify('browser'),
  }),

  new CopyWebpackPlugin([{
    from: './client/template.html',
    to: 'template.html',
  }]),
];

if (env.isProd) plugins.push(new webpack.optimize.UglifyJsPlugin());


export default merge(common, {
  entry: {
    bundle: ['babel-polyfill', './client/entry-client'],
    lib: config.lib,
  },

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: 'chunk.[name].[chunkhash:8].js',
  },

  resolve: {
    alias: {
      ...config.nonIsomorphicModule,
    },
  },

  plugins,
});
