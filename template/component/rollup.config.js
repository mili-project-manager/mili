import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'
import config from './build.config'


export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  ...config,

  plugins: [
    json(),
    resolve(),
    babel({
      babelrc: false,
      presets: [
        ["env", { modules: false }],
      ],
      plugins: ["transform-object-rest-spread", "external-helpers"],
      // runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
}]
