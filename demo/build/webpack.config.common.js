/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import env from 'detect-env';
import webpack from 'webpack';

import config from '../build.config'
import { vueLoader, babelLoader, urlLoader } from './loaders';


// base client config
export default {
  context: path.resolve(__dirname, '..'),
  devtool: !env.is.prod && '#cheap-module-source-map',
  mode: env.is.prod ? 'production' : 'development',

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      { test: /\.vue/, exclude: /node_modules/, use: [vueLoader] },
      { test: /\.js$/, exclude: /node_modules/, use: [babelLoader] },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, use: [urlLoader] },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  resolve: {
    alias: config.alias,
    extensions: ['.js', '.vue'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
