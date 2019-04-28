# 命令及功能


## mili init [option] [repository]

**功能**

初始化项目

**选项**
* `-n` or `--app-name` 设置项目名称。
  如果未设定，则以根目录中package.json文件的项目名为准；
  如果文件不存在或者未设置name字段，则以根目录文件夹名称为准。
* `-v` or `--version` 设置模版版本号。
  默认为最新版本（e.g. `-v 1.2.3`）。

## mili upgrade

**功能**

升级项目模版，如果模板已是最新版本，则提示无需升级。

**选项**
* `-r` or `--recursive` 查找当前文件夹下所有的子文件夹，并且升级所有包含`.milirc`文件的目录
* `--ignore [file]` 忽略检索的目录（支持`glob`）。
  与`-r`的配合使用。
  可以设置多个，（e.g. `npx mili upgrade -r --ignore "**/node_modules" --ignore "**/src"`）

## mili update

**功能**

使用当前项目所依赖的版本模版，对项目中的文件内容进行一次更新。
可以用于修复被手动更改的模版禁止更改文件。

**选项**

* `-v` or `--version` 设置模版版本号。
  默认为最新版本（e.g. `-v 1.2.3`）。


## mili clean

**功能**

清理mili缓存的文件，如克隆的模版仓库。
