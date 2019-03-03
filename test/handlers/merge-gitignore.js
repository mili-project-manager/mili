const mergeGitignore = require('../../src/handlers/merge/merge-gitignore')


const file = {
  content: 'x\na\nb\nd\ne\nt',
  targetFile: {
    content: 'b\na\nc\ne\nf',
  },
}

console.log(mergeGitignore(file))
