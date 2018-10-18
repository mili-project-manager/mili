# ![mili logo](../../images/mili.svg)

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)


**从同一个脚手架衍生出来的项目，随着时间的流逝，很多地方会逐渐变得不一致**
也就是说：脚手架对于项目的后续发展失去了控制力。
当我们想要升级一些脚手架的基础功能（例：eslint规则）时，我们不得不去升级每一个项目，甚至不得不对一些改动过大的项目设计定制化的升级方案。

因此，为了提高脚手架对项目后续发展的控制力，mili允许固化一部分文件，并为这部分文件提供升级功能。
如果你们团队管理着多个项目，并希望这些项目具有统一的、可持续迭代的代码规范、基础功能、框架结构，mili非常适合作为你们的脚手架工具。

## Usage

mili主要有两个功能，创建项目和升级项目，让我们分别来看看如何使用。

### 创建项目
mili是一个脚手架，可以使用符合mili规范的模版来初始化项目。
在此，我们使用一个用于创建模版的mili模版 -- [mili-template](https://github.com/Val-istar-Guo/mili-template)。
来创建一个模板项目。

```
# 在项目目录下执行
npx mili init https://github.com/Val-istar-Guo/mili-template.git
```

这样就通过脚手架和mili-template模版创建了一个项目。
依照mili-template设定的规范，.czrc、.commitlintrc.yml等文件是不能修改的必须与模版的规范一致。
而package.json可以添加自定义的东西，但是如果字段在mili-template中已经进行了设置，或者未来模版添加了这个字段，都会以模版规范为准，覆盖本地相同的字段配置。这保证了整个团队项目基本规范和使用方式一致性。

### 升级项目

在项目根目录下运行`mili upgrade`，由于mili-template已经将这条命令加入package.json的script中，
所以我们可以直接运行`npm run upgrade`升级项目依赖的模板。
就像之前说的，升级会导致很多文件的覆盖。如果你真的私自改动过这些文件，请认真核对mili-template模板的CHANGE_LOG并进行必要的升级。
当前项目依赖的模板版本可以在`.milirc.yml`文件中查看。


## 生命周期

以命令`npx mili init https://github.com/Val-istar-Guo/mili-template.git`为例介绍初始化项目的生命周期：

* git clone https://github.com/Val-istar-Guo/mili-template.git
* 获取**项目根目录**下的package.json
* 获取package.json中main属性指定的入口文件
* 载入入口文件，得到模版相关的配置信息（以下称'模版配置'）。
* 从模版配置中得到项目模板文件的存放的路径，文件/文件夹的升级/复制规则等信息
* 将指定的模版文件存放路径下的所有文件拷贝到用户执行命令的目录下。
* 生成.milirc配置文件

然后执行`npm run upgrade`的生命周期为：

* 获取.milirc配置，并从中获取项目依赖的模板repository和version。
* git clone repository
* 获取**项目根目录**下的package.json，从中获取当前模板版本，判断是否需要升级，如果需要，则继续
* 获取package.json中main属性指定的入口文件
* 载入入口文件，得到模版相关的配置信息（以下称'模版配置'）。
* 从模版配置中得到项目模板文件的存放的路径，文件/文件夹的升级/复制规则等信息
* 将模板文件按照升级规则拷贝的项目目录中
* 生成.milirc配置文件


## 模版入口文件/配置文件字段

[模版开发规范](./TemplateDevelopment.md)

模板入口文件/配置文件可以为json/yml/js格式。需要含有以下一些字段

**config.path**

模版文件的存放路径。路径下的文件将被拷贝到项目目录中。

**config.engines**

模版支持的mili版本，必须符合[semver](https://www.npmjs.com/package/semver)规范。

**config.rules**

根据的拷贝/升级规则

**config.rules[].path**
文件路径，此路径必须为相对于*config.path*的路径。可以为文件或者文件夹。
如果配置的文件夹，文件夹下所有的文件都将应用这个规则。
如果这个文件夹下又有文件/文件夹单独设置了规则，新的规则生效。


**config.rules[].upgrade**
升级规则，有三种可选：
* `keep`：此类文件/文件夹只有在初始化的时候拷贝到用户项目目录。
* `merge`：此类文件会和用户的当前对应的文件合并，并以模板文件为准。（目前仅支持json格式）
* `cover`：此规则为默认规则，对未设置的文件/文件夹应用。

**config.rules[].handlers**
文件处理方式，在读取文件内容后，会将文件相关属性信息，项目基本信息作为一个包传入处理器，处理器会返回一个相同结构的包，但是每种处理器会根据自己的规则对包的内容进行调整，包括但不限于改变文件内容，改变文件名称，提取当前项目信息。处理器会按照数组先后顺序对逐个经过。并将最终生成的内容写入项目目录中。

这里介绍一个重要处理器'mustache'：
[mustache](https://www.npmjs.com/package/mustache)是一个模板引擎。文件内容作为模板，项目信息作为view，渲染出来的内容做输出，并去掉文件名胃部的`.mustache`扩展名。


### 用于模版引擎渲染的项目信息对象

```json
{
  "name": "项目名称",
  "repository": "项目的git仓库",
  "template": {
    "repository": "模板的git仓库",
    "version": "依赖的模板版本"
  },
  "mili": {
    "version": "使用的mili版本"
  },
  "custom": {}
}
```

未来会支持一种新的handler: 在升级时提取当前项目中的对应文件内容，并获取某些属性。这些属性也将放入项目信息中，暂定在custom字段中。
这些属性也可以在模版渲染中使用，从而支持更高级的文件升级方式。


### E.g.

```javascript
// mili-template的模板配置
exports.path = './template'

// mili version >= 1.0.0
exports.engines = ">=1.0.0<2.0.0"


exports.rules = [
  {
    path: './template',
    upgrade: 'keep',
  },
  {
    path: './index.js',
    upgrade: 'keep',
  },
  {
    path: 'package.json.mustache',
    upgrade: 'merge',
    handlers: ['mustache']
  },
  {
    path: 'README.md.mustache',
    handlers: [
      'mustache',
      // core => core.extractHtmlCustomArea('custom')
    ],
  },
]
```


## Shell命令详解

**mili init [option] [repository]**

功能：初始化项目
options:
* `-n` or `--app-name` 设定项目名称。
  如果未设定，则以根目录中package.json文件的项目名为准；
  如果文件不存在或者未设置name字段，则以根目录文件夹名称为准。

**mili upgrade**

功能：升级项目模版，如果模板已是最新版本，则提示无需升级。


## Contributing & Development

如果存在如何疑问，非常欢迎提issue一起讨论。请在讨论时，遵守[Contributor Covenant Code of Conduct](https://github.com/Val-istar-Guo/mili/blob/master/.github/CODE_OF_CONDUCT.md)与[CONTRIBUTING](https://github.com/Val-istar-Guo/mili/blob/master/.github/CONTRIBUTING.md)，共同维护良好的社区环境。
