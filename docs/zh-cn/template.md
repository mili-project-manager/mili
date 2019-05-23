# Template

模版的入口文件必须是模版的配置文件。mili会尝试以下方式读取入口文件：

1. 读取package.json文件中main字段所配置的文件路径指向的文件
2. 读取模版项目根目录下名为`entry.js`的文件

入口文件的配置选项：

 字段        | 类型       | 描述 | 示例
:------------|:-----------|:-----------|:--------
 path        | `string`   | 存储模版文件的文件夹路径（绝对路径或者相对于入口文件的路径） | `'./template'`
 engines     | `string`   | 依赖的mili版本 | `'>=2.0.0 <3.0.0'`
 rules       | `object[]` | 每个文件的创建/升级配置 | 后面详细介绍
 hooks       | `object`   | 生命周期钩子 | 后面详细介绍
 interaction | `object[]` | 依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。使得用户可以自定义模版参数 | 后面详细介绍

## 版本管理

模版的版本管理对于项目升级非常有用. 因为:

1. mili的版本检查会在模版升级重大版本的时候提醒用户。
2. 项目可以使用某个特定的模版版本。
3. 运行`npx mili upgrade`时，如果模版版本已经是最新版，mili会给出提醒用户。
3. 用户升级模版版本的时候，Changelog信息非常有用。
3. `npx mili outdated`命令可以正常使用。

mili模版需要遵照 [语义版本控制规范](https://semver.org/).
npm本身就有版本管理，所以对于模版就是npm包的来说，就按照npm规范发包即可。
然而，如果模版是托管于git的仓库，你需要手动打`tag`来记录项目版本。
并且，`tag`的格式需要符合`v.0.0.1`这种格式。

## 文件规则配置(`rules`)

这是Mili最核心的部分，针对不同的文件，配置不同的规则，从而实现每个文件的定制化升级。文件的配置格式如下：

 field    | type                       | description | example
:---------|:---------------------------|:-----------|:--------
 path     | `string`                   | 文件相对于存储模版文件夹的路径
 handlers | `Function[]` or `string[]` | 文件的处理器，多个处理器将会按照先后顺序处理文件。这个决定了文件的升级效果，是mili设计思想的核心。
 upgrade  | `'cover'` or `'keep'` or `'merge'` or `'exist'` | 这是handlers的语法糖，可以与handlers一起使用，功能是自动向handlers末尾增加一些处理器，简化书写。

示例：

```javascript
exports.rules = [{
  path: 'README.md.mustache',
  handlers: [
    // 提取项目文件中<!-- custom -->之前的数据，放入`view.custom.content`
    core => core.extractArea('content', '<!-- custom -->'),
    // 提取项目文件中<!-- custom -->之前的数据，放入`view.custom.content`
    core => core.extractArea('description', '<!-- description -->'),
    // README.md.mustache 作为模版，view作为视图（数据），通过mustache模版处理器，渲染出新的README.md文件
    'mustache',
  ],
}]
```

## 模版视图(`view`)

从上面的示例中可以看到，模版文件也可以是一个模版，并且可以通过像[mustache](https://github.com/janl/mustache.js)这样的处理器渲染成项目文件。

众所周知，渲染文件需要`模版`和`视图`（数据）。模版文件就是渲染文件的模版，可是`视图`从哪里获取呢？

`视图`是由mili提供的，包含项目、模版、mili、用户自定义参数等信息的数据结构。`视图`的结构如下：

 key       | type                                  | description
:----------|:--------------------------------------|:--------------
 operation | `'init'` or `'upgrade'` or `'update'` | 操作类型
 mili      | `object`                              | mili工具信息
 template  | `object`                              | 模版配置信息
 project   | `object`                              | 项目信息
 custom    | `object`                              | 处理器设置的自定义信息(例如： `extractArea` 处理器)

### view.mili

 key       | type                   | description
:----------|:-----------------------|:--------------
 version   | 版本号                  | mili工具的版本号

### view.template

 key         | type                        | description
:------------|:----------------------------|:--------------
 path        | `string`       | 存储模版文件的文件夹路径（绝对路径或者相对于入口文件的路径） | `'./template'`
 engines     | `string`       | 依赖的mili版本 | `'>=2.0.0 <3.0.0'`
 rules       | `object[]`     | 每个文件的创建/升级配置 | Details later
 hooks       | `object`       | 生命周期钩子 | Details later
 interaction | `object[]`     | 依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。使得用户可以自定义模版参数 | Details later

### view.project

 key       | type                        | description
:----------|:----------------------------|:--------------
 path      | `string`                    | 项目路径
 answers   | `object`                    | template.interaction 定义的问题的用户输入的结果

### view.answers

`mili.project.answers`的拷贝

### view.custom

处理器可以将一些数据挂载在`view.custom`上面。举个例子：`core => core.extractArea('content', '<!-- custom -->')`，
`extractArea`处理器将会提取项目文件中两个`'<!-- custom -->'`之间的数据，并将数据放在`view.custom.content`上。

## 生命周期钩子（`hooks`）

钩子函数可以运行在mili的某个运行阶段执行一些命令。支持shell命令或者`javascript`函数（支持async）。
目前支持的钩子列表：

 field        | description                            | example
:-------------|:---------------------------------------|:--------
 afterInit    | `npx mili init`结束后触发    | `{ afterInit: 'npm install' }`
 afterUpgrade | `npx mili upgrade`结束后触发 | `{ afterUpgrade: 'npm install' }`
 afterUpdate  | `npx mili update` 结束后触发 | `{ afterUpdate: 'npm install' }`

## 模版交互工具（`interaction`）

依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。使得用户可以自定义模版参数
可以从`view.anwsers`或`view.project.anwsers`获得用户输入结果。

示例:

```javascript
exports.interaction = [
  { type: 'input', name: 'key', message: 'question' }
]

// => get anwser from `view.anwsers.key` or `view.project.anwsers.key`
```
