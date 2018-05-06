import babelLoader from './babel-loader.config';


export default {
  loader: 'vue-loader',
  options: {
    loaders: {
      scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
      js: [babelLoader],
    },
  },
};
