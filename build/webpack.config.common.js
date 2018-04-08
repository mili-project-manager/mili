/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import env from 'detect-env';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import config from '../build.config'
import { vueLoader, babelLoader, urlLoader } from './loaders';


// NOTE remove DeprecationWarning
// process.noDeprecation = true;

const extractSCSS = new ExtractTextPlugin('styles/[name]-sass.css');
const extractCSS = new ExtractTextPlugin('styles/[name]-css.css');


// PLUGINS
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];
if (env.is.prod) plugins.push(extractCSS, extractSCSS);


// base client config
export default {
  context: path.resolve(__dirname, '..'),
  devtool: !env.is.prod && '#cheap-module-source-map',
  mode: 'development',

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
        use: env.detect({
          prod: extractCSS.extract({ fallback: 'vue-style-loader', use: 'css-loader' }),
          default: ['vue-style-loader', 'css-loader'],
        }),
      },
      {
        test: /\.scss$/,
        use: env.detect({
          prod: extractSCSS.extract({ fallback: 'vue-style-loader', use: ['css-loader', 'sass-loader'] }),
          default: ['vue-style-loader', 'css-loader', 'sass-loader'],
        }),
      },
    ],
  },

  resolve: {
    alias: config.alias,
    extensions: ['.js', '.vue'],
  },
  plugins,
};
