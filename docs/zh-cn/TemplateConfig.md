## 模版入口文件/配置文件字段


模板入口文件/配置文件可以为json/yml/js格式。需要含有以下一些字段

# config.path

**类型**

`String`

**含义**

模版文件的存放路径。路径下的文件将被拷贝到项目目录中。


## config.engines

**类型**

`String`

**含义**

模版支持的mili版本，必须符合[semver](https://www.npmjs.com/package/semver)规范。


## config.hooks

**类型**

`Object`

**含义**

生命周期勾子，在某个指定的生命周期运行shell命令

**例子**

```js
exports.hooks = {
  // 初始化结束后运行，必须为shell命令
  afterInit: 'echo "Welcome to use mili"',
}
```


## config.rules

**类型**

`Array`

**含义**

模版文件的拷贝/升级规则列表


**config.rules[].path**

**类型**

`String`

**含义**

文件路径，此路径必须为相对于*config.path*的路径。可以为文件或者文件夹。
如果配置的文件夹，文件夹下所有的未配置规则的子文件/子文件夹都将应用这个规则。
如果这个文件夹下又有文件/文件夹单独设置了规则，新的规则生效。


**config.rules[].upgrade**

**类型**

`Enum`('keep', 'merge', 'cover')

**含义**

升级规则，有三种可选：

* `keep`：此类文件/文件夹只有在初始化的时候拷贝到用户项目目录。
* `merge`：此类文件会和用户的当前对应的文件合并，并以模板文件为准。（目前仅支持json格式）
* `cover`：此规则为默认规则，对未设置的文件/文件夹应用。


**config.rules[].handlers**

**类型**

`Array`

**含义**

文件处理器的列表。
