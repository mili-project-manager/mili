# ![mili logo](../../images/mili.svg)

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)


**从同一个脚手架衍生出来的项目，随着时间的流逝，很多地方会逐渐变得不一致**
也就是说：脚手架对于项目的后续发展失去了控制力。
当我们想要升级一些脚手架的基础功能（例：eslint规则）时，我们不得不去升级每一个项目，甚至不得不对一些改动过大的项目设计定制化的升级方案。

因此，为了提高脚手架对项目后续发展的控制力，mili允许固化一部分文件，并为这部分文件提供升级功能。
如果你们团队管理着多个项目，并希望这些项目具有统一的、可持续迭代的代码规范、基础功能、框架结构，mili非常适合作为你们的脚手架工具。

[详细使用指南请戳这里](./Guide.md)


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


### E.g.

- [mili-template](https://github.com/Val-istar-Guo/mili-template)
- [component-template](https://github.com/Val-istar-Guo/component-template)


## Contributing & Development

如果存在如何疑问，非常欢迎提issue一起讨论。请在讨论时，遵守[Contributor Covenant Code of Conduct](https://github.com/Val-istar-Guo/mili/blob/master/.github/CODE_OF_CONDUCT.md)与[CONTRIBUTING](https://github.com/Val-istar-Guo/mili/blob/master/.github/CONTRIBUTING.md)，共同维护良好的社区环境。
