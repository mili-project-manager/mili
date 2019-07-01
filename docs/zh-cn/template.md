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
 question    | `object[]` | 依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。使得用户可以自定义模版参数

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

 field    | type                                   | description | example
:---------|:---------------------------------------|:-----------|:--------
 path     | `string`                               | 文件相对于存储模版文件夹的路径
 handlers | `Function[]` or `string[]` or `object` | 文件的处理器，多个处理器将会按照先后顺序处理文件。这个决定了文件的升级效果，是mili设计思想的核心。[Handler 详细介绍](./handler/index.md)
 upgrade  | `'cover'` or `'keep'` or `'merge'` or `'exist'` | 这是handlers的语法糖，可以与handlers一起使用，功能是自动向handlers末尾增加一些处理器，简化书写。

示例：

```javascript
exports.rules = [{
  path: 'README.md.mustache',
  handlers: [
    // 提取项目文件中<!-- custom -->之前的数据，放入`file.addition.custom.content`
    core => core.extractArea('content', '<!-- custom -->'),
    // 提取项目文件中<!-- custom -->之前的数据，放入`file.addition.custom.content`
    core => core.extractArea('description', '<!-- description -->'),
    // README.md.mustache 作为模版，resource作为视图（数据），通过mustache模版处理器，渲染出新的README.md文件
    'mustache',
  ],
}]
```

## 生命周期钩子（`hooks`）

钩子函数可以运行在mili的某个运行阶段执行一些命令。支持shell命令或者`javascript`函数（支持async）。
目前支持的钩子列表：

 field        | description                            | example
:-------------|:---------------------------------------|:--------
 initialized  | `npx mili init`结束后触发    | `{ initialized: 'npm install' }`
 upgraded     | `npx mili upgrade`结束后触发 | `{ upgraded: 'npm install' }`
 updated      | `npx mili update` 结束后触发 | `{ updated: 'npm install' }`
 checked      | `npx mili check` 结束后处罚  | `{ }`
 rendered     | 所有文件渲染完成后触发，在`initialized`、`upgraded`、`updated`三个hook之前执行 | `{ rendered: 'npm install' }`

## 模版交互工具（`questions`）

依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。
使得用户可以自定义模版参数。可以从`resource.answers`获得用户输入结果。

示例:

```javascript
exports.interaction = [
  { type: 'input', name: 'key', message: 'question' }
]

// => get answer from `resource.answers.key`
```
