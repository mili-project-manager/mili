const urlLoader = {
  loader: 'url-loader',
  options: { limit: 10000 },
};

export default { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, use: [urlLoader] }
