import { resolve } from 'path'


const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [[
      'env',
      {
        useBuiltIns: true,
        modules: false,
        targets: { browser: ['>5%'] },
      }
    ]],
  },
}

const vueLoader =  {
  loader: 'vue-loader',
  options: {
    loaders: {
      js: [babelLoader],
    },
  },
}

const urlLoader = {
  loader: 'url-loader',
  options: { limit: 10000 },
}

export default {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'assistPlugin',
    libraryTarget: 'jsonp',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  externals: { vuex: 'vuex' },
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
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
}
