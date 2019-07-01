exports.path = './template'
exports.rules = [
  {
    path: 'keep',
    upgrade: 'keep',
  },
  {
    path: 'exist.yml',
    upgrade: 'exist',
  },
  {
    path: 'deleted.md',
    handler: core => core.deleteWhen(resource => resource.operation === 'upgrade'),
  },
  {
    path: 'package.json.mustache',
    upgrade: 'merge',
    handler: 'mustache',
    encoding: {
      binary: '.jpg$',
    },
  },
  {
    path: 'readme.md.mustache',
    handlers: [
      core => core.extractArea('content', '<!-- custom -->'),
      'mustache',
    ],
    encoding: 'utf8',
  },
  {
    path: 'test.+(yml|yaml|json)',
    upgrade: 'merge',
  },
  {
    path: '.npmignore',
    upgrade: 'merge',
    glob: false,
  },
]
exports.hooks = {
  rendered: "echo 'test string hook'",
  updated: () => {
    console.log('test function hook')
  },
}
