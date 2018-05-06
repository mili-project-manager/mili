import path from 'path'
import webpack from 'webpack'
import env from 'detect-env'
import merge from 'webpack-merge'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import config from '../build.config'
import common from './webpack.config.common'


const plugins = [
  new VueSSRClientPlugin({
    filename: config.manifestFilename,
  }),

  new webpack.DefinePlugin({
    'process.env.WEB_CONTAINER': JSON.stringify('browser'),
  }),

  new CopyWebpackPlugin([
    {
      from: './client/template.html',
      to: 'template.html',
    },
    {
      from: './client/manifest.json',
      to: 'manifest.json',
    },
    {
      from: './client/service-worker.js',
      to: 'service-worker.js',
    },
    {
      from: './node_modules/sw-toolbox/sw-toolbox.js',
      to: 'sw-toolbox.js',
    },
  ]),
]

if (env.is.prod) plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
if (process.env.ANALYZER) plugins.push(new BundleAnalyzerPlugin())



export default merge(common, {
  entry: {
    bundle: ['babel-polyfill', './client/entry-client'],
  },

  output: {
    filename: env.is.prod ? '[name].[chunkhash:8].js' : '[name].[hash].js',
    chunkFilename: env.is.prod ? 'chunk.[name].[chunkhash:8].js' : 'chunk.[name].[hash].js',
  },

  resolve: {
    alias: {
      ...config.nonIsomorphicModule,
    },
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: {
      name: 'runtime',
    }
  },

  plugins,
})
