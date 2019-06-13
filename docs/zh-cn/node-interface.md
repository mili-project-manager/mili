# NodeJS API

mili 提供了 Node.js API，可以在 Node.js 运行时下直接使用。


```javascript
import mili from 'mili'

mili.init({ repository })
mili.upgrade()
mili.update()
mili.outdated()
mili.clean()
```

## `mili.init(options)`

 option      | default                               | description
:------------|:--------------------------------------|:--------------
 *repository | -                                     | 模版仓库地址. [see more](./cli#repository)
 name        | `basename of cwd` or `progress.cwd()` | 设置应用名
 version     | `latest version`                      | 设置模版版本
 cwd         | `progress.cwd()`                      | 设置当前的工作目录
 noDeps      | `false`                               | 是否安装模版依赖，不安装可以节约时间
 force       | `false`                               | 跳过安全检测

## `mili.upgrade(options)`

 option     | default          | description
:-----------|:-----------------|:--------------
 cwd        | `progress.cwd()` | 设置工作目录
 noDeps     | `false`          | 是否安装模版依赖，不安装可以节约时间
 force      | `false`          | 跳过安全检测
 recursive  | `false`          | 升级目录下所有的项目，深度遍历目录下所有的子文件夹。
 ignore     | `[]`             | 当设置`--recursive`时，忽略遍历某一些文件夹。可以避免错误升级或者用于检测节约时间。例如忽略`node_modules`文件夹可以节约大量时间。

## `mili.update(options)`

 option  | default                  | description
:--------|:-------------------------|:--------------
 version | current template version | 设置模版版本
 cwd     | `progress.cwd()`         | 设置工作目录
 noDeps  | `false`                  | 是否安装模版依赖，不安装可以节约时间
 force   | `false`                  | 跳过安全检测

## `mili.outdated(options)`

 option  | default                  | description
:--------|:-------------------------|:--------------
 cwd     | `progress.cwd()`         | 设置工作目录

## `mili.clean()`

No options.

## `mili check`

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`     | 设置工作目录
 `--no-deps`                | -                    | 是否安装模版依赖，不安装可以节约时间
 `-r --recursive`           | -                    | 检查目录下所有的项目，深度遍历目录下所有的子文件夹。
 `--ignore [file]`          | -                    | 当设置`--recursive`时，忽略遍历某一些文件夹。可以避免错误升级或者用于检测节约时间。例如忽略`node_modules`文件夹可以节约大量时间。
 `-d --diff`                | `false`              | 展示文件内容的差异，类似`git diff`
 `--fold`                   | `false`              | 展示内容差异时，折叠未改动的代码。配合`--diff`使用