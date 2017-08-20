import path from 'path';


// 扩展配置
export default {
  ssrFileName: 'vue-ssr-bundle.json',
  manifestFileName: 'vue-ssr-manifest.json',
  /**
   * 非同构模块, 不可用于ssr在server端运行
   * 会被默认替代为empty.js
   * 需要在代码中进行兼容处理
   */
  nonIsomorphicModule: [],

  // 非JS模块，不可用于ssr, ssr代码需要在nodejs中运行
  nonJsModule: [
    'normalize.css',
  ],

  // 外部依赖库，打包成独立js包
  lib: [
    'vue',
    'vuex',
    'vue-router',
    'detect-env',
    'superagent',
  ],

  alias: {
    framework: path.resolve(__dirname, '../framework'),
  },
}
