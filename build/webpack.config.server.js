import path from 'path';
import fs from 'fs';

import { dependencies } from '../package.json';
import config from './config';

function getExternals() {
  return Object.keys(dependencies);
}


export default {
  context: path.resolve(__dirname, '..'),
  entry: { bundle: './server' },
  target: 'node',
  externals: getExternals(),

  node: {
    __filename: false,
    __dirname: false,
  },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    alias: {
      // vue: 'vue/dist/vue.common',
      ...config.alias,
    },
  },
};
