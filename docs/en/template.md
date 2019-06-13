# Template

The template's entry file exposes the configuration of the template.
Mili will try to find the entry file in these places in the template repository.

1. the main field defined in package.json
2. the entry.js in project root.

The entry file should export the template config:

 field       | type       | descripton | example
:------------|:-----------|:-----------|:--------
 path        | `string`   | The folder path of template files that relative to the entry file | `'./template'`
 engines     | `string`   | The range of mili version | `'>=2.0.0 <3.0.0'`
 rules       | `object[]` | The configuration of each file | Details later
 hooks       | `object`   | The hook will run on the lifecycle of the mili | Details later
 interaction | `object[]` | Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters | Details later

## Version Management

Version Management is usefully when project upgrade the template. Because:

1. Version checking of mili will give user a warning when MAJOR template version upgrade,
2. Users can upgrade to a specific version of the template.
3. If you run `npx mili upgrade` when the template version is up to date, mili can give a warning.
3. Changelog is usefully when upgrade template.
3. `npx mili outdated` command will available.

Mili fllows [Semantic Versioning](https://semver.org/).
For template published to npm, npm is already version management.
However, for templates hosted in the git repository, you need to manually tag the version.
And tag must conform to the format like `v0.0.1`.

## Template Files Rule

The rules is an array of object, that describe how each file is rendered:

 field    | type                       | description | example
:---------|:---------------------------|:-----------|:--------
 path     | `string`                   | The file path that relative to the folder path of template files
 handlers | `Function[]` or `string[]` | The array of handler used to handle file one by one. It determines the behavior of the file when it is initialized and upgraded. This is also the design philosophy of the mili template.
 upgrade  | `'cover'` or `'keep'` or `'merge'` or `'exist'` | This is the syntactic sugar of the handlers, and can be used simultaneously with the handlers. Used to automatically add some handlers based on different modes.

An rules example:

```javascript
exports.rules = [{
  path: 'README.md.mustache',
  handlers: [
    core => core.extractArea('content', '<!-- custom -->'),
    core => core.extractArea('description', '<!-- description -->'),
    'mustache',
  ],
}]
```

## Template View

From the above example you will find that the template file can be a template. And could be hanled by template handler like [mustache](https://github.com/janl/mustache.js).

It is well known that rendering files requires a template and a view. The template is our template file. But where did the view get from?

View is a data provided by mili and contains basic information about the anwser, project, template and mili.

The view construction:

 key       | type                                  | description
:----------|:--------------------------------------|:--------------
 operation | `'init'` or `'upgrade'` or `'update'` | The operation of cli
 mili      | `object`                              | The information about mili used
 template  | `object`                              | The information about template
 project   | `object`                              | The information about project
 custom    | `object`                              | The custom key-value set by handler(e.g. `extractArea` handler)

### view.mili

 key       | type                        | description
:----------|:----------------------------|:--------------
 version   | semver version              | The running mili version

### view.template

 key         | type                        | description
:------------|:----------------------------|:--------------
 path        | `string`       | The folder path of template files that relative to the entry file | `'./template'`
 engines     | `string`       | The range of mili version | `'>=2.0.0 <3.0.0'`
 rules       | `object[]`     | The configuration of each file | Details later
 hooks       | `object`       | The hook will run on the lifecycle of the mili | Details later
 interaction | `object[]`     | Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters | Details later

### view.project

 key       | type                        | description
:----------|:----------------------------|:--------------
 path      | `string`                    | The project path
 answers   | `object`                    | The answers of interaction setted in template config

### view.answers

This is the copy of `mili.project.answers`

### view.custom

This is an object, used to mount data by handler.
Let's see an example: `core => core.extractArea('content', '<!-- custom -->')`.
The `extractArea` handler will extract the text between the `'<!-- custom -->'`.
And you can get the text from `view.custom.content`.


## Template Hooks

The hook will run on the lifecycle of the mili.
And it can be a shell command(string) or a javascript function(support async).

The hooks currently available are:

 field        | description                            | example
:-------------|:---------------------------------------|:--------
 afterInit    | Run after `npx mili init` completed    | `{ afterInit: 'npm install' }`
 afterUpgrade | Run after `npx mili upgrade` completed | `{ afterUpgrade: 'npm install' }`
 afterUpdate  | Run after `npx mili update` completed  | `{ afterUpdate: 'npm install' }`

## Template Interaction

Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters.
And you can find the answsers.

example:

```javascript
exports.interaction = [
  { type: 'input', name: 'key', message: 'question' }
]
```

Then, you can get the anwser from `view.answsers.key`.