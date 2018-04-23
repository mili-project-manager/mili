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
};

export default {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'assistPlugin',
    libraryTarget: 'jsonp',
  },
  mode: 'development',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: [babelLoader] },
    ]
  },
}
