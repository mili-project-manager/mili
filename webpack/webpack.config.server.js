import path from 'path';
import fs from 'fs';

import { dependencies } from '../package.json';
import { ALIAS } from './webpack.config.base';

function getExternals() {
  return Object.keys(dependencies);
    // .filter(key => (
    //   !NON_JS_NODE_MODULES.includes(key)
    // ));
}

/**
 * @desc 获取node_module下所有的模块列表,用于配置webpack.externals，
 *       从而在打包时无需打包这些模块。
 *
 * @return {Object}
 */
// function getExternals() {
//   /* eslint-disable no-param-reassign */
//   return fs.readdirSync(path.resolve(__dirname, './node_modules'))
//       // .bin目录保存模块带来的终端命令，并非模块
//       .filter(filename => !filename.includes('.bin'))
//       // 指定模块为commonjs规范
//       .reduce((externals, filename) => {
//         externals[filename] = `commonjs ${filename}`;
//         return externals;
//       }, {});
//   /* eslint-enable no-param-reassign */
// }

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

  // resolve: {
  //   alias: {
  //     vue: 'vue/dist/vue.common',
  //   },
  // },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // presets: [['es2015', { modules: false }]],
              plugins: [
                ['transform-object-rest-spread'],
                ['transform-export-extensions'],
              ],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: ALIAS,
  },

};
