import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import clientConfig from './webpack.config.client';


export default merge(clientConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
