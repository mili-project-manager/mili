import path from 'path'
import fs from 'fs'
import env from 'detect-env'
import nodeExternals from 'webpack-node-externals'

import { dependencies } from '../package.json'
import config from '../build.config'


export default {
  context: path.resolve(__dirname, '..'),

  entry: env.detect({
    prod: './server',
    default: './server/server',
  }),

  mode: env.is.prod ? 'production' : 'development',
  target: 'node',
  externals: nodeExternals(),

  node: {
    __filename: false,
    __dirname: false,
  },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: env.is.prod ? 'bundle.js' : 'bundle.[chunkhash:8].js',
    chunkFilename: 'chunk.[chunkhash:8].js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    alias: { ...config.alias },
  },
};
