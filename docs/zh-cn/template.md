# Template

## 目录结构

mili对模板的项目结构有及其严格的约束条件


```
|
├─ mili.json                # 模板的基础信息
├─ hooks.json               # 安装/升级/更新模板时触发的生命周期钩子
├─ questions.json           # 依赖inquirer实现的命令行交互工具。使得用户可以自定义模版参数
├─ templates.json           # 定义模板文件的文件各种配置属性
├─ migration                # 升级模板时，若模板版本低于迁移脚本的版本号，则脚本会在升级时执行
|   ├─ 1.0.0.sh
|   ├─ 2.0.0.sh
|   └─ ...
|
└─ templates                # 存放模板文件的目录
    ├─ package.json.hbs
    ├─ eslintrc.json
    └─ ...
```

 文件/文件夹        | 是否必须 | 详细说明
:-----------------|:--------|:--------
 `mili.json`      | 是      | 模板的基础信息
 `hooks.json`     | 否      | 安装/升级/更新模板时触发的生命周期钩子
 `questions.json` | 否      | 依赖inquirer实现的命令行交互工具。使得用户可以自定义模版参数
 `migration`      | 否      | 升级模板时，若模板版本低于迁移脚本的版本号，则脚本会在升级时执行。版本号必须符合[semver](https://semver.org/)规范。
 `templates.json` | 是      | 定义模板文件的文件各种配置属性
 `templates`      | 是      | 存放模板文件的目录

###### 文件/文件夹的名称不可修改


## `mili.json`

 属性名     | 是否必须 | 格式                    | 详细说明
:----------|:-------|:------------------------|:---------
 `version` | 否      | `string`               | 模板的版本号，如果不填写，则使用package.json的版本号
 `engines` | 否      | `string[]`             | 需要使用的`mili`版本
 `extends` | 否      | `(string \| object)[]` | 此模板需要依赖其他模板
 `loaders` | 否      | `(string \| object)[]` | 需要使用的数据加载器，加载的数据将用于模板渲染

Example:

```json5
{
  // 需要mili版本大于4.0.0才可以使用此模板
  "engines": [">4.0.0"],
  // mili渲染此模板时，会先渲染"npm:@mtpl/code-style"模板，然后再执行此模板的渲染
  "extends": ["npm:@mtpl/code-style"],
  // 将会读取使用者项目的npm信息和git信息
  "loaders": ["npm", "git"]
}
```

## `template.json` 与 `templates`

`templates`文件夹下定义了一系列的模板文件，这些文件将会依据`templates.json`中配置的规则，渲染到使用者的项目中去。

假设我们的模板有如下目录：

```
├─ templates.json
└─ templates
    ├─ package.json.hbs
    └─ eslintrc.json
```

`templates.json`的中可以这样进行配置：

```json5
[
  {
    // 相对于./templates目录的文件路径，支持glob
    "path": ".eslintrc.yml",
    "handlers": [
      /**
       * 将模板的文件和使用者项目目录下的同名文件进行合并
       * 如果文件存在字段冲突，则以模板文件的定义为准
       *
       * 这个`handler`限制使用者不可以修改模板的eslint规则
       * 但是允许其进行自定义额外的eslint规则
       */
      "merge-yaml"
    ]
  },
  {
    "path": "package.json.hbs",
    "handlers": [
      /**
       * 使用`handlebars`引擎进行文件渲染
       * 此`handler`会自动移除文件的扩展名`.hbs`
       * 渲染使用的视图数据在`mili`中称之为`resource`
       * `resource`包含`loader`加载的数据、`questions.json`产生的`answers`以及其他`handler`产生的数据
       * 后续会详细讲解`resource`及如何开发一个自定义的`loader`或`handler`
       */
      "handlebars",
      /**
       * 与`merge-yaml`类似
       * `handler`的先后执行顺序会影响渲染结果
       */
      "merge-json"
    ]
  }
]

```

### Resource

`resource`是一个`Map()`对象，功能是存储渲染模板过程中产生的各种数据。其用途主要有以下几点：

* 作为`handlebars`、`ejs`等模板渲染类的`handler`的视图数据
* `handler`可以向`resource`中添加数据，影响后续`handler`的行为，实现数据通信

`mili`默认会在`resource`上挂载一部分数据：

- `resource.answers`: `questions.json`中定义问题的回答结果
- `resource.milirc.template`: 模板名称
- `resource.milirc.version`: 模板的版本号

在`mili.json`中配置`"loaders": ["npm", "git"]`将会从项目中加载的数据放入`resource`。

以`npm loader`为例：

- `resource.npm.name`: 使用者项目目录下`package.json`文件的`name`
- `resource.npm.version`: 使用者项目目录下`package.json`文件的`version`
- `resource.npm.description`: 使用者项目目录下`package.json`文件的`description`

## `questions.json`

有些模板需要询问使用者一些问题，才能确定如何进行渲染，此文件用于定义问题。
`mili`使用[inquirer](https://www.npmjs.com/package/inquirer)实现功能。
`questions.json`的配置也请参考[inquirer](https://www.npmjs.com/package/inquirer)文档。

Example:

```json
[
  {
    "type": "confirm",
    "name": "isUseConventionalCommits",
    "message": "Conventional Commits",
    "default": true
  }
]
```

## `hooks.json`

`hooks.json`可以定义在mili的某个运行阶段执行shell命令。
支持的钩子列表：

 field          | description
:---------------|:-----------------------------
 before-init    | `npx mili init`运行前触发
 before-update  | `npx mili update`运行前触发
 before-upgrade | `npx mili upgrade` 运行前触发
 before-check   | `npx mili check` 运行前触发
 before-render  | 任意命令前触发
 after-init     | `npx mili init`运行后触发
 after-update   | `npx mili update`运行后触发
 after-upgrade  | `npx mili upgrade`运行后触发
 after-check    | `npx mili check`运行后触发
 after-render   | 任意命令运行后触发
