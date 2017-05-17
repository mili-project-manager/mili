/**
 * NOTE webpack base config is the Duplicate code
 *      in webpack.config.ssr.js and webpack.config.client.js
 */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


// NOTE remove DeprecationWarning
process.noDeprecation = true;

// NOTE const extractSCSS = new ExtractTextPlugin('styles/[name]-style.css');
const extractCSS = new ExtractTextPlugin('styles/lib.css');


// NOTE non-isomorphic package
export const NON_ISOMORPHIC_NODE_MODULES = {
  // chart: 'chart.js',
};


/**
 * NOTE modules should be packing by webpack for ssr
 *      like json, css, and more file could not be
 *      import by nodejs
 */
export const NON_JS_NODE_MODULES = ['normalize.css'];


// NOTE commonality alias
export const ALIAS = {
  utils: path.resolve(__dirname, '../utils'),
  contants: path.resolve(__dirname, '../contants'),
};


// NOTE commonality node modules used by client
export const LIB =  [
  'vue',
  'vuex',
  'vue-router',

  'detect-env',
  'material-design-icons',
  'superagent',
];


// base client config
export const base = {
  context: path.resolve(__dirname, '..'),

  entry: {
    bundle: ['./client'],
  },

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
                ['transform-export-extensions'],
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
    alias: ALIAS,
    extensions: ['.js', '.vue'],
  },

  plugins: [
    extractCSS,
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new ProgressBarPlugin({ summary: false }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
