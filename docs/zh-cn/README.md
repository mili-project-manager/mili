# ![mili logo](../../images/mili.svg)

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/Val-istar-Guo/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)


**从同一个脚手架衍生出来的项目，很多细节会渐渐变得不一致**
也就是说：脚手架对于项目的后续发展失去了控制力。
当我们想要升级一些脚手架的基础功能（例：eslint规则）时，我们不得不去升级每一个项目，甚至不得不对一些改动过大的项目设计定制化的升级方案。

因此，为了提高脚手架对项目后续发展的控制力，mili允许模版固化一部分文件，并为这部分文件提供升级功能。
如果你们团队管理着多个项目，并希望这些项目具有统一的、可持续迭代的代码规范、基础功能、框架结构，mili非常适合作为你们的脚手架工具。

[详细使用指南请戳这里](./Guide.md)


## Usage

mili主要有两个功能，创建项目和升级项目，让我们分别来看看如何使用。

### 创建项目

我们使用一个用于创建模版的mili模版 -- [mili-template](https://github.com/Val-istar-Guo/mili-template)。
来创建一个模板项目。

```
# 在项目目录下执行
npx mili init https://github.com/Val-istar-Guo/mili-template.git
```

这样就通过脚手架和mili-template模版创建了一个项目。

依照mili-template设定的规范，.czrc、.commitlintrc.yml等文件是不能修改的，必须要与模版的规范一致。
而package.json可以添加自定义的东西，但是如果字段在mili-template中已经进行了设置，或者未来模版添加了这个字段，都会以模版规范为准，覆盖本地相同的字段配置。这保证了整个团队项目基本规范和使用方式一致性。


### 升级项目

```shell
# 在项目目录下执行
mili upgrade
```

由于mili-template已经将这条命令加入package.json的script中， 我们可以直接运行`npm run upgrade`升级项目依赖的模板。
升级会按照模版设定的规则对对一些文件进行覆盖。


## 正反馈

### 模版 => 项目

模版的更新都会按照设定的文件升级方案应用到每个使用这个模版的项目中去，减轻每个项目进行升级的工作量。

### 项目 => 模版

当存在一下情况时：

1. 被模版固化的基础功能/结构无法满足项目的业务需求
2. 模版固化的文件存在bug

这时候，项目的开发者需要对模版进行更新。因为只有跟新到模版后，才能‘安全的’将这些改动应用到项目中来（通过升级模版）。
与此同时，模版 => 项目的反馈也会为所有的项目带来bug升级、新特性、或结构性调整，减少其他项目升级工作量。


## E.g.

- [mili-template](https://github.com/Val-istar-Guo/mili-template)
- [component-template](https://github.com/Val-istar-Guo/component-template)


## Q&A

### template的模版非常像是一个依赖包，为什么不将模版提成一个npm包呢？

1. 其实，模版的一部分功能确实应该抽象成一个库，将打包、发布、公司内部服务甚至server等全部按照统一规范包装成一个库（npm包）。

   但是，这只是理想状况。通常来说，团队始于一个模版，一个项目，逐步发展到多个项目。
   经过很长一段时间，总结经验，最终才会形成一个规范的库。
   而在这段时间内，将会面临每个项目中实现细节分化的问题。

   最终，在将有一致规范的功能抽象为库的过程中，需要大量改造项目，带来很大的项目改造开发量。

   mili可以在这个过程中起到缓冲作用和辅助升级作用，保证所有项目具有一致的模版。

2. 有些文件无法抽象到库中，但是还需要在所有项目里统一。例如：issue模版、readme.md的内容结构等东西。
   必须要放在项目根目录下才能被识别，但是又需要跟随模版升级、多项目统一。

3. 并非所以的依赖的开源工具都能像webpack一样同时提供`编程模式`、`shell模式`两种使用方式。
   有些工具目前只支持*识别项目根目录下的配置文件*来运行，例如：husky。统一这部分文件，mili做起来更容易些。

因此，即使已经将具有统一规范的功能完全的抽象为一个库，依旧有很大的可能，在每个项目下面，存在一些需要多项目统一的文件。

另外，必须要说明的一点是**将具有统一规范的部分提取成库与mili并不冲突**。往往你提取完成后，得到的依旧是一个简化的轻量级的模版。


###### `编程模式`是指，其支持在`js`中`require('xxx')`，并传入参数来运行。这样能方便的集成到库中。
###### `shell模式`是指，需要通过shell命令+配置文件的方式运行。这样集成到库中难度会大些。


## Contributing & Development

如果存在如何疑问，非常欢迎提issue一起讨论。请在讨论时，遵守[Contributor Covenant Code of Conduct](https://github.com/Val-istar-Guo/mili/blob/master/.github/CODE_OF_CONDUCT.md)与[CONTRIBUTING](https://github.com/Val-istar-Guo/mili/blob/master/.github/CONTRIBUTING.md)，共同维护良好的社区环境。
