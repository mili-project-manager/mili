import merge from 'webpack-merge'

import base from './webpack.config.server';


export default merge(base, {
  entry: {
    bundle: './server/server',
  },
  output: {
    filename: '[name].[chunkhash:8].js',
  },
});
