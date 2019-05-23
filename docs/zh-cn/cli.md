## CLI

使用 `npx mili -h`查看最新介绍

### `mili init [options] [repository]`

创建项目

#### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-n --app-name [app_name]` | `basename of cwd` or `progress.cwd()`  | 设置应用名
 `-v --version [version]`   | 最新版本                                | 设置模版版本
 `--cwd [cwd]`              | `progress.cwd()`                       | 设置当前的工作目录
 `--no-deps`                | -                                      | 是否安装模版依赖，不安装可以节约时间
 `--force`                  | -                                      | 跳过安全检测

#### repository

模版项目的存储地址，支持的类型有：

 repository          | description                           | example
:--------------------|:--------------------------------------|:--------
 `github:owner/name` | github仓库clone地址的缩写 | `npx mili init github:Val-istar-Guo/mili-template`
 `npm:package-name`  | 模版项目可以是npm包。需要注意的是，有一些文件可能在发布时被忽略（例如：`.gitignore`）。如果这是你模版文件的一部分，需要进行特殊处理。| `npx mili init npm:mili-template`
 clone with HTTPS    | 模版项目的存储地址是一个远程git仓库 | `npx mili init https://github.com/Val-istar-Guo/mili-template.git`
 clone with SSH      | 模版项目的存储地址是一个远程git仓库 | `npx mili init git@github.com:Val-istar-Guo/mili-template.git`
 relative path       | 从指定的相对路径获取模版项目. 当在一个仓库中，管理多个具有相同模版项目时非常有用。例如使用learn工具时。 | `npx mili init ./template/module-template`
 absolute path       | 从制定的绝对路径获取模版项目，往往用于测试 | `npx mili ini /template/test-template`

### `mili upgrade [options]`

升级项目依赖的模版版本。

#### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`                       | 设置工作目录
 `--no-deps`                | -                                      | 是否安装模版依赖，不安装可以节约时间
 `--force`                  | -                                      | 跳过安全检测
 `-r --recursive`           | -                                      | 升级目录下所有的项目，深度遍历目录下所有的子文件夹。
 `--ignore [file]`          | -                                      | 当设置`--recursive`时，忽略遍历某一些文件夹。可以避免错误升级或者用于检测节约时间。例如忽略`node_modules`文件夹可以节约大量时间。

### `mili update [options]`

使用指定版本（默认为当前版本）的模版更新项目。

#### options

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `-v --version [version]`   | 当前模版版本           | 设置模版版本
 `--cwd [cwd]`              | `progress.cwd()`     | 设置工作目录
 `--no-deps`                | -                    | 是否安装模版依赖，不安装可以节约时间
 `--force`                  | -                    | 跳过安全检测

### `mili clean`

清理mili缓存，例如缓存的已下载的模版项目

### `mili outdated`

检查项目的模版版本是否已经过时
