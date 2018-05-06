import { resolve } from 'path'
import webpack from 'webpack'
import env from 'detect-env'
import { babelLoader } from './loaders';


const plugins = [];
if (env.is.prod) plugins.push(new webpack.optimize.OccurrenceOrderPlugin())

export default {
  context: resolve(__dirname, '..'),
  entry: ['babel-polyfill', './client/service-worker'],

  output: {
    path: resolve(__dirname, '../dist/client'),
    filename: 'service-worker.js',
    publicPath: '/',
  },

  mode: env.is.prod ? 'production' : 'development',

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: [babelLoader] },
    ]
  },

  plugins,
}
