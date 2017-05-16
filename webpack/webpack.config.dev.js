import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { base, NON_ISOMORPHIC_PACKAGE } from './webpack.config.base';

export const htmlFileName = 'index.dev.html';

export default {
  ...base,
  devtool: 'source-map',
  entry: {
    bundle: [
      ...base.entry.bundle,
      'webpack-hot-middleware/client',
    ],

    lib: [
      'vue',
      'vue-router',
      'vuex',
    ],
  },
  resolve: {
    ...base.resolve,
    alias: {
      ...base.resolve.alias,
      ...NON_ISOMORPHIC_PACKAGE,
    },
  },
  plugins: [
    ...base.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: 'lib',
      filename: '[name].js',
    }),
    new HtmlWebpackPlugin({
      filename: path.join('../views/', htmlFileName),
      template: './views/index.html',
    }),
  ],
};
