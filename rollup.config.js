import typescript from 'rollup-plugin-typescript'
import tsPath from 'rollup-plugin-ts-paths'
import json from 'rollup-plugin-json'
import autoExternal from 'rollup-plugin-auto-external'
import { string } from 'rollup-plugin-string'


const warnFilter = /The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten/

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: true,
  },

  onwarn: (warning, warn) => {
    const str = warning.toString()

    if (warnFilter.test(str)) return
    warn(warning)
  },

  plugins: [
    autoExternal(),
    tsPath(),
    json(),
    typescript(),
    string({
      include: '**/*.mustache',
    }),
  ],
}
