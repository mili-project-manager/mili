import typescript from 'rollup-plugin-typescript'
import tsPath from 'rollup-plugin-ts-paths'
import json from 'rollup-plugin-json'
import autoExternal from 'rollup-plugin-auto-external'

const warnFilter = /The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten/

const onwarn = (warning, warn) => {
  const str = warning.toString()

  if (warnFilter.test(str)) return
  warn(warning)
}

const plugins = [autoExternal(), tsPath(), json(), typescript()]

const sourcemap = process.env.NODE_ENV === 'development'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap,
    },

    onwarn,
    plugins,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/index.js',
      format: 'esm',
      sourcemap,
    },

    onwarn,
    plugins,
  },
]
