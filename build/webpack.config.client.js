import path from 'path';
import webpack from 'webpack';
import env from 'detect-env';
import merge from 'webpack-merge';
import config from './config';
import base from './webpack.config.base';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';


const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: 'lib',
    filename: '[name].[chunkhash:8].js',
  }),

  new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
  }),

  new VueSSRClientPlugin({
    filename: config.manifestFilename,
  }),

  new webpack.DefinePlugin({
    'process.env.VUE_ENV': JSON.stringify('client'),
  }),

  new CopyWebpackPlugin([{
    from: './client/template.html',
    to: 'template.html',
  }]),
];

if (env.isProd) plugins.push(new webpack.optimize.UglifyJsPlugin());


export default merge(base, {
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

