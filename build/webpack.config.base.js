/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import env from 'detect-env';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


import config from './config';


// NOTE remove DeprecationWarning
process.noDeprecation = true;

const extractSCSS = new ExtractTextPlugin('styles/[name]-sass.css');
const extractCSS = new ExtractTextPlugin('styles/[name]-css.css');


// base client config
export default {
  context: path.resolve(__dirname, '..'),
  devtool: env.isProd ? false : '#cheap-module-source-map',

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
              loaders: {
                scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
                js: [{
                  loader: 'babel-loader',
                  options: {
                    presets: [['env', {
                      useBuiltIns: true,
                      modules: false,
                      targets: {
                        browser: ['>5%'],
                      },
                    }]],
                  },
                }],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          fallback: 'vue-style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', {
                useBuiltIns: true,
                modules: false,
                targets: {
                  browser: ['>5%'],
                },
              }]],
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
    extractSCSS,

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
