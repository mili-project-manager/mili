# 生命周期勾子（Hooks）

如果你需要运行一些shell命令或脚本来帮助模版初始化/升级/更新，生命周期勾子可以帮你的忙。

**由于模版的依赖并不会被安装。所以，如果想要运行node脚本，需要先使用`npm i --no-save pange_name`安装依赖，再通过`node path_of script`运行node脚本**

## Hooks

名称             |   运行时
:---------------|:-----------------------
`afterInit`     | `mili init`完成后运行
`afterUpdate`   | `mili update`完成后运行
`afterUpgrade`  | `mili upgrade`完成后运行
