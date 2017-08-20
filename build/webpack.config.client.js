import path from 'path';
import webpack from 'webpack';
import env from 'detect-env';
import merge from 'webpack-merge';
import config from './webpack.config.expand';
import base from './webpack.config.base';
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin';


const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: 'lib',
    filename: '[name].[chunkhash:8].js',
  }),

  new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
  }),

  new VueSSRClientPlugin({
    filename: config.manifestFileName,
  }),
];

if (env.isProd) plugins.push(new webpack.optimize.UglifyJsPlugin());


export default merge(base, {
  entry: {
    bundle: ['./client/entry-client'],
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

