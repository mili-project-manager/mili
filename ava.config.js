module.exports = {
  files: ['tests/**/*.ts', '!tests/**/*.before-each.ts'],
  typescript: {
    rewritePaths: {
      'tests/': 'lib/tests/',
    },
    compile: false,
  },
}
