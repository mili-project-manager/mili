import babelLoader from './babel-loader.config';


export default {
  loader: 'vue-loader',
  options: {
    loaders: {
      js: [babelLoader],
    },
  },
};
