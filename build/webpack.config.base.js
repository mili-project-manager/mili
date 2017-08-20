/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import env from 'detect-env';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import config from './webpack.config.expand';


// NOTE remove DeprecationWarning
process.noDeprecation = true;

// NOTE const extractSCSS = new ExtractTextPlugin('styles/[name]-style.css');
const extractCSS = new ExtractTextPlugin('styles/lib.css');


// base client config
export default {
  context: path.resolve(__dirname, '..'),
  devtool: env.isProd ? 'nosources-source-map' : 'inline-source-map',

  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        // include: /node_modules/,
        // use: ['vue-style-loader', 'css-loader'],
        use: extractCSS.extract({
          fallback: 'vue-style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.vue/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              // extractCSS: true,
              loaders: {
                scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        // use: extractSCSS.extract({
        //   fallback: 'vue-style-loader',
        //   use: [
        //     {
        //       loader: 'css-loader',
        //       // options: {
        //       //   modules: true,
        //       //   localIdentName: '[name]__[local]-[hash:base64:5]',
        //       // },
        //     },
        //     {
        //       loader: 'sass-loader',
        //     },
        //   ],
        // }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015', { modules: false }]],
              plugins: [
                ['transform-runtime', { polyfill: false, helpers: false }],
                ['transform-object-rest-spread'],
              ],
            },
          },
        ],
      },

      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: config.alias,
    extensions: ['.js', '.vue'],
  },

  plugins: [
    extractCSS,

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
