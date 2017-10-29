// Unified build configuration
import { resolve } from 'path';


// 扩展配置
export default {
  ssrFilename: 'vue-ssr-bundle.json',
  manifestFilename: 'vue-ssr-manifest.json',
  /**
   * 非同构模块, 不可用于ssr在server端运行
   * 会被默认替代为empty.js
   * 需要在代码中进行兼容处理
   */
  nonIsomorphicModule: {
    // chart: 'chart.js',
  },

  // 外部依赖库，打包成独立js包
  lib: [
    'vue',
    'vuex',
    'vue-router',
    'detect-env',
    'superagent',
  ],

  alias: {
    framework: resolve(__dirname, '../framework'),
  },
}
