# ![mili logo](./docs/images/mili.svg?sanitize=true)

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![coveralls](https://img.shields.io/coveralls/github/Val-istar-Guo/mili.svg?style=flat-square)](https://coveralls.io/github/Val-istar-Guo/mili)


[简体中文](./docs/zh-cn/readme.md)


**Projects that derived from the same scaffolding, have evolved over time and become different.**
Scaffolding lost control of the subsequent development of the project.
When we need to improve some of the basic functions of scaffolding(e.g. eslint rules), we need to modify each project, and even have to design a customized solution for some old projects.

Therefore, in order to improve the control ability of scaffolding for the subsequent development of the project,template can modified some files and release new template version, then project can upgrade the template version.

It is useful for team project management.

## Usage

The basic principle of mili.

![theory](./docs/images/handlers.svg?sanitize=true)

1. First, you need to design your own template or use someone else's template.
2. Make project directory and run `npx mili init template_path`.
3. Run `npx mili upgrade`, when template is out of date.

### Init Project

Let's use a existed template.

```shell
// template in github
npx mili init github:Val-istar-Guo/mili-template.git
// template in npm
npx mili init npm:mili-template
// template in private git repository
npx mili init https://github.com/Val-istar-Guo/mili.git
```

### Upgrade

The upgrade operation is very simple to use.The effect of the upgrade is determined by the handlers configured for each file in the template configuration.

```shell
npx run upgrade
```

The handler can extract the data of the project file, or use the template file as a [mustache](https://github.com/janl/mustache.js) template, and the project data as a view to render a new project file that will cover old one.

The handlers can be flexibly and freely combined to implement a variety of initialization and upgrade modes.


### Template

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

#### Version Management

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

#### Template Files Rule

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

#### Template View

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

##### view.mili

 key       | type                        | description
:----------|:----------------------------|:--------------
 version   | semver version              | The running mili version

##### view.template

 key         | type                        | description
:------------|:----------------------------|:--------------
 path        | `string`       | The folder path of template files that relative to the entry file | `'./template'`
 engines     | `string`       | The range of mili version | `'>=2.0.0 <3.0.0'`
 rules       | `object[]`     | The configuration of each file | Details later
 hooks       | `object`       | The hook will run on the lifecycle of the mili | Details later
 interaction | `object[]`     | Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters | Details later

##### view.project

 key       | type                        | description
:----------|:----------------------------|:--------------
 path      | `string`                    | The project path
 answers   | `object`                    | The answers of interaction setted in template config

##### view.answers

This is the copy of `mili.project.answers`

##### view.custom

This is an object, used to mount data by handler.
Let's see an example: `core => core.extractArea('content', '<!-- custom -->')`.
The `extractArea` handler will extract the text between the `'<!-- custom -->'`.
And you can get the text from `view.custom.content`.


#### Template Hooks

The hook will run on the lifecycle of the mili.
And it can be a shell command(string) or a javascript function(support async).

The hooks currently available are:

 field        | description                            | example
:-------------|:---------------------------------------|:--------
 afterInit    | Run after `npx mili init` completed    | `{ afterInit: 'npm install' }`
 afterUpgrade | Run after `npx mili upgrade` completed | `{ afterUpgrade: 'npm install' }`
 afterUpdate  | Run after `npx mili update` completed  | `{ afterUpdate: 'npm install' }`

#### Template Interaction

Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters.
And you can find the answsers.

example:

```javascript
exports.interaction = [
  { type: 'input', name: 'key', message: 'question' }
]
```

Then, you can get the anwser from `view.answsers.key`.

## CLI

Use `npx mili -h` to see more detials of cli.

### `mili init [options] [repository]`

init project

#### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-n --app-name [app_name]` | `basename of cwd` or `progress.cwd()`  | Set application name
 `-v --version [version]`   | latest version                         | Set the template version
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.

#### repository

The repository of template, The supported repository types are:

 repository          | description                           | example
:--------------------|:--------------------------------------|:--------
 `github:owner/name` | Shorthand of github repository. It is equal to https url used to clone | `npx mili init github:Val-istar-Guo/mili-template`
 `npm:package-name`  | The template could be an npm package. Note that some file names will be ignored at the time of publish(e.g. `.gitignore`). | `npx mili init npm:mili-template`
 clone with HTTPS    | Clone template from repository. | `npx mili init https://github.com/Val-istar-Guo/mili-template.git`
 clone with SSH      | Clone template from repository. | `npx mili init git@github.com:Val-istar-Guo/mili-template.git`
 relative path       | Get template from the relative path. It is useful when managing a lot of packages that use a unified template in a repository. (e.g. lerna) | `npx mili init ./template/module-template`
 absolute path       | Get template from the absolute path.It is often used for testing | `npx mili ini /template/test-template`

### `mili upgrade [options]`

upgrade your project if then template depended outdated.

#### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.
 `-r --recursive`           | -                                      | Upgrade recursive all subfolder.
 `--ignore [file]`          | -                                      | Folders that do not need to be searched when recursively upgrading

### `mili update [options]`

Update your project file with the current version of the template

#### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-v --version [version]`   | current template version               | Set the template version
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.

### `mili clean`

Clean the cache of mili(e.g. cloned template)

### `mili outdated`

Check if the file is out of date


## Node Interface

Mili provides a Node.js API which can be used directly in Node.js runtime.

```javascript
import mili from 'mili'

mili.init({ repository })
mili.upgrade()
mili.update()
mili.outdated()
mili.clean()
```

### `mili.init(options)`

 option      | default                               | description
:------------|:--------------------------------------|:--------------
 *repository | -                                     | The repository path. [see more](#repository)
 name        | `basename of cwd` or `progress.cwd()` | Set application name
 version     | `latest version`                      | Set the template version
 cwd         | `progress.cwd()`                      | Set the current work directory
 noDeps      | `false`                               | Don't install template dependencies. You can save some time, if don't install dependencies.
 force       | `false`                               | Enforce command. Ignore security check.

### `mili.upgrade(options)`

 option     | default          | description
:-----------|:-----------------|:--------------
 cwd        | `progress.cwd()` | Set the current work directory
 noDeps     | `false`          | Don't install template dependencies. You can save some time, if don't install dependencies.
 force      | `false`          | Enforce command. Ignore security check.
 recursive  | `false`          | Upgrade recursive all subfolder.
 ignore     | `[]`             | Folders that do not need to be searched when recursively upgrading

### `mili.update(options)`

 option  | default                  | description
:--------|:-------------------------|:--------------
 version | current template version | Set the template version
 cwd     | `progress.cwd()`         | Set the current work directory
 noDeps  | `false`                  | Don't install template dependencies. You can save some time, if don't install dependencies.
 force   | `false`                  | Enforce command. Ignore security check.

### `mili.outdated(options)`

 option  | default                  | description
:--------|:-------------------------|:--------------
 cwd     | `progress.cwd()`         | Set the current work directory

### `mili.clean()`

No options.

## See More

[mili-template](https://github.com/Val-istar-Guo/mili-template): An simple mili template. This can be used as a reference for first time template writing.
