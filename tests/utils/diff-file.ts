import test from 'ava'
import { diffFile } from '@/utils'


test('Show file diff', t => {
  let j1 = JSON.stringify({
    compilerOptions: {
      outDir: './lib',
      moduleResolution: 'node',
      module: 'commonjs',
      target: 'es6',
      strict: true,
      noImplicitAny: false,
      esModuleInterop: true,
      resolveJsonModule: true,
      baseUrl: './',
      noEmitOnError: true,
      paths: {
        '@/*': ['src/*'],
      },
    },
    exclude: ['node_modules'],
    include: ['src/**/*.ts'],
  }, null, '  ')
  let j2 = JSON.stringify({
    compilerOptions: {
      outDir: './lib',
      moduleResolution: 'node',
      module: 'commonjs',
      target: 'es6',
      strict: true,
      noImplicitAny: false,
      esModuleInterop: true,
      resolveJsonModule: true,
      baseUrl: './',
      noEmitOnError: true,
      paths: {
        '@/*': ['src/*'],
      },
    },
    exclude: ['node_modules'],
  }, null, '  ')

  j2 += '\n'

  t.snapshot(diffFile('jx', j1, j2))
  t.snapshot(diffFile('jx', j1, j2, { fold: true }))
  t.snapshot(diffFile('jx', j2, j1, { fold: true }))

  j1 += '\n'
  t.snapshot(diffFile('jx', j2, j1, { fold: true }))
  t.snapshot(diffFile('jx', '', '1', { fold: true }))
})
