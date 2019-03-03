# 模版渲染

mili除了支持模版中的普通的文件进行合并、覆盖外，还支持模版文件的渲染功能。这也是实现更灵活可控升级的核心功能。


mili可以通过在`config.rules`中设置文件的`handlers`来控制文件的模版渲染功能。
因此，mili允许我们的模版下存在模版文件。这样说可能有点拗口。
用代码中的变量来描述`config.path`指定的目录下，某个文件可以为模版(`template`)。
mili会通过handler进行`template`+`view`渲染得到的**结果**，并将结果输出到项目目录中。

目前，项目支持的模版只有[mustache](https://www.npmjs.com/package/mustache)。
未来还将对[ejs](https://www.npmjs.com/package/ejs)等进行支持。
如果有被我忽略的优秀模版引擎，请给我提[Issue](https://github.com/Val-istar-Guo/mili/issues)。


模版渲染主要分三部分：`template`、`view`、`handler`.


## template

文件模版需要存放在`config.path`（项目模版路径）指定的目录下，假设我们有一个文件`package.json.mustache`如下：

```json
{
  "name": "{{name}}",
  "main": "dist/index.js",
}
```

这样我们就创建了一个模版


## view

view是**文件模版**中用于渲染模版使用的数据。上面我们模版中使用到的`name`就是这样一个数据。
view的结构是mili获取当前用户项目的各种信息组合成的一个结构，结构如下：

```js
const view = {
  mili: {
    // 运行的mili版本
    version: '1.10.0',
  },
  project: {
    // 项目的本地路径
    path: 'path_to_project',
    // 项目名称，来自用户项目目录下package.json中的name字段，初始化时可能是由用户指定或者目录名。
    name: 'project name',

    // 项目远程仓库
    repository: {
      // 仓库的类型，
      type: 'git/local',
      // 仓库托管的服务商
      service: 'github',
      // 仓库的url，从用户项目目录下package.json中的repository字段获取。
      // 如果字段不存在，则获取项目本地仓库关联的远程仓库的列表中的第一个仓库地址。
      url: 'https://github.com/Val-istar-Guo/mili.git',
      // 仓库的归属用户，目前仅支持github的git链接识别。无法从url上识别得到则为null
      owner: 'Val-istar-Guo',
      // 仓库名，目前仅支持github的git链接识别。无法从url上识别得到则为null
      name: 'mili',
    },
  },

  // 模版信息
  template: {
    // 模版的远程仓库地址
    repository: {
      // 仓库的类型，
      type: 'git/local',
      // 仓库托管的服务商
      service: 'github',
      // 仓库的url，从用户项目目录下package.json中的repository字段获取。
      // 如果字段不存在，则获取项目本地仓库关联的远程仓库的列表中的第一个仓库地址。
      url: 'https://github.com/Val-istar-Guo/mili.git',
      // 仓库的归属用户，目前仅支持github的git链接识别。无法从url上识别得到则为null
      owner: 'Val-istar-Guo',
      // 仓库名，目前仅支持github的git链接识别。无法从url上识别得到则为null
      name: 'mili',
    },
    // 模版的版本
    version: {
      commit: 'ad67824adbef....',
      ref: 'ref/tags/v1.2.3',
      number: '1.2.3',
    },

    // 以下为模版的入口/配置文件相关配置信息
    path: '',
    encoding: '',
    engines: '',
    rules: [],
    hooks: {},
  },

  // 通过handler注入到view中的其他信息，每个文件都不一样
  custom: {},
}
```

这就是mili生成的完整的view结构。其中`custom`字段允许通过handler向其中注入值。

> 向`view.custom`中注入值可以实现更灵活可控的升级方案，例如：
> 你虽然将`readme.md.mustache`文件设置为`cover`模式，
> 但是你却可以从用户项目中的`readme.md`中提取出被`<!-- custom -->`包裹的一部分，并注入到view.custom中。
> 再渲染到模版。这样就允许用户对文件的某一部分自定义，而另一部分可以统一。
> 从而可以实现一个团队中的项目的`readme`，具有统一的章节结构。


## handlers

我们需要在模版的入口文件中配置上处理这个**模版文件**的handler（之后称之为处理器），这才能正常工作。

```js
exports.rules = [
  {
    path: 'package.json.mustache',
    upgrade: 'merge',
    handlers: ['mustache']
  },
]
```

`mustache`这个处理器的功能：

* 删除文件名（`file.targetPath`）中的`.mustache`后缀
* 将`file.content`作为模版，`file.view`作为数据，得到新的`file.content`

经过处理器处理完的file将会被mili与项目中当前的`package.json`文件合并后写入项目目录中。


![handlers](../images/handlers.png)



> 其实merge也是一个handler，
> 上面的配置信息在实际运行中被转化成了
> ```js
> exports.rules = [
>    {
>      path: 'package.json.mustache',
>      upgrade: 'merge',
>      handlers: ['mustache'， 'merge']
>    },
> ]
> ```
> 在实际上执行完`mustache`处理器后会执行`merge`处理器，读取项目目录中的`package.json`文件并合并
> mili最终拿到`file`对象后，只需要覆盖项目目录下的文件就可以了。
