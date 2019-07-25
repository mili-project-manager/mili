# Handler

`handler`是由两个`function`组成的`object`，结构如下：

```typescript
interface Handler {
  genFile: (file: CompiledFile, resource: Readonly<Resource>): Promise<void>
  genPath: (path: string, resource: Readonly<Resource>): Promise<string>
}
```

`mili` 将先运行所有`handler`的`genPath`，然后再运行`genFile`。
这样做保证了在`genFile`时可以读取正确的项目文件内容。
<!-- `mili` run all `genPath` of handlers first, then the `genFile`.
It is beacuse `genFile` may be need to read the project file.

There are two main parameters, `file` and `resource`.Let's to show you how to use them. -->

这里有两个重要的参数：`file`和`resource`。接下来详细介绍如何使用这两个参数。

## file

通过修改`file`的`content`属性，可以控制最终渲染到项目文件的文件内容。
未经handler处理的`file.content`是模版文件的内容。
通过`delete`、`renderable`控制渲染`file`时的行为。

 key                | type                                  | description
:-------------------|:--------------------------------------|:--------------
 content            | `string`                              | 写入项目文件的内容
 projectFileExisted | `boolean`                             | 项目文件是否存在
 getProjectContent  | `() => Promise<string>`               | 获取当前项目文件的内容。不要使用`fs`读取文件，使用`getProjectContent`更加安全。
 deleted            | `boolean`                             | 是否删除文件，默认为`false`。当设置为`true`时，项目文件将被删除，`file.content`也不会被渲染。
 renderable         | `boolean`                             | 是否渲染文件，默认为`true`。当设置为`false`时，`file.content`将不会覆盖项目文件原有内容。
 addition           | `object`                              | 文件的额外信息，默认是`{}`。


## resource

包含mili的所有运行时的只读数据。

 key       | type                                  | description
:----------|:--------------------------------------|:--------------
 operation | `'init'` or `'upgrade'` or `'update'` | 操作类型
 mili      | `object`                              | mili工具信息
 template  | `object`                              | 模版配置信息
 project   | `object`                              | 项目信息

### resource.mili

 key       | type                   | description
:----------|:-----------------------|:--------------
 version   | 版本号                  | mili工具的版本号

### resource.template

 key         | type           | description
:------------|:---------------|:--------------
 path        | `string`       | 存储模版文件的文件夹路径（绝对路径或者相对于入口文件的路径）
 engines     | `string`       | 依赖的mili版本
 files       | `object[]`     | 每个文件的创建/升级配置 |
 hooks       | `object`       | 生命周期钩子
 question    | `object[]`     | 依赖 [inquirer](https://github.com/SBoudrias/Inquirer.js/) 实现的命令行交互工具。使得用户可以自定义模版参数

### resource.project

 key       | type                        | description
:----------|:----------------------------|:--------------
 path      | `string`                    | 项目路径
 answers   | `object`                    | template.interaction 定义的问题的用户输入的结果

## 内置`hadnler`

- exist[./exist.md]
- merge[./merge.md]
- mustache[./mustache.md]
- ignoreWhen[./ignore-when.md]
- extractArea[./extract-area.md]

## 更多`handler`

- [mili-handler-additional-property](https://github.com/Val-istar-Guo/mili-handler-additional-property): 在`file.addition`上添加自定义属性。
- [mili-handler-prettier](https://github.com/Val-istar-Guo/mili-handler-prettier): 将文件内容使用`prettier`格式化。
- [mili-handler-ejs](https://github.com/Val-istar-Guo/mili-handler-ejs): 编译`ejs`模版的`handler`。
