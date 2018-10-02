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
  test: /\.js$/,
  exclude: file => ( /node_modules/.test(file) && !/\.vue\.js/.test(file)),
  use: [babelLoader],
}
