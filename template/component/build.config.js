import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'

export const plugins = [
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
]

export const compiler = config => {
  const clone = {...config};
  if (config && config.output && !config.output.format) clone.output.format = 'cjs'
  if (!config.plugins) clone.plugins = plugins

  return clone
}
