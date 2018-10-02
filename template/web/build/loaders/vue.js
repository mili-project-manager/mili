const vueLoader = {
  loader: 'vue-loader',
  // options: {
  //   loaders: {
  //     scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
  //     js: [babelLoader],
  //   },
  // },
};

export default { test: /\.vue/, exclude: /node_modules/, use: [vueLoader] };
