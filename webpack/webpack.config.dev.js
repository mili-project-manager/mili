import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { base, NON_ISOMORPHIC_PACKAGE, LIB } from './webpack.config.base';
import HTML_FILE_NAME from '../contants/html-file-name';

export default {
  ...base,
  devtool: 'source-map',

  entry: {
    bundle: [
      ...base.entry.bundle,
      'webpack-hot-middleware/client',
    ],

    lib: LIB,
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
      filename: path.join('../views/', HTML_FILE_NAME),
      template: './views/index.html',
    }),
  ],
};
