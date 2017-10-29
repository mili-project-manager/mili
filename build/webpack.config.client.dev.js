import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import clientConfig from './webpack.config.client';


export default merge(clientConfig, {
  entry: {
    bundle: [
      'webpack-hot-middleware/client',
    ],
  },

  devServer: {
    contentBase: './dist',
    hot: true
  },

  output: {
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js',
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
