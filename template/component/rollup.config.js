import { compiler } from './build.config'


export default compiler({
  input: 'src/index.js',
  output: { file: 'dist/bundle.js' },
})
