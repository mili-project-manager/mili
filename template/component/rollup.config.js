import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },

  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [
        ["env", {
          modules: false
        }],
      ],
      plugins: ["transform-object-rest-spread", "external-helpers"],
      // runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
  ],
}];
