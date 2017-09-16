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
    // publicPath: path.resolve(__dirname, '../dist/server'),
    chunkFilename: 'chunk.[name].js',
    libraryTarget: 'commonjs2',
  },

  resolve: {
    alias: {
      // vue: 'vue/dist/vue.common',
      ...config.alias,
    },
  },

  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: [
  //         {
  //           loader: 'babel-loader',
  //           options: {
  //             presets: [['es2015', { modules: false }]],
  //             plugins: [
  //               ['transform-object-rest-spread'],
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
};
