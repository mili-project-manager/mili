# Handler

执行`echo "export function compile() {}" >> your_handler.js`即可快速创建一个Handler。
虽然他什么功能也没有。

只需要在文件中`export`一个命名为`compile`的函数，就可以作为`mili`的Handler。
`compile`函数的具体出入参数如下：

```typescript
export type Compile = (dist: Path, src: Path, filepath: Path, resource: Map<string, any>, options: Record<string, any>) => Syncable<Path | void>
```

## 函数的参数说明

 key                |  description
:-------------------|:--------------
 dist               | 存放项目的文件目录
 src                | 存放模板的文件夹目录
 filepath           | 模板文件的相对地址
 resource           | 资源数据
 options            | 配置参数


## 内置`hadnler`

- [`'handlebars'`](./handlebars.md)
- [`'merge-json'`](./merge-json.md)
- [`'merge-yaml'`](./merge-yaml.md)
- [`'ignore'`](./ignore)
- [`'delete'`]( ./delete.md )
- [`'init'`](./init.md)
