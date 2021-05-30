# Loader


执行`echo "export function exec() {}" >> your_loader.js`即可快速创建一个Loader。
虽然他什么功能也没有。

只需要在文件中`export`一个命名为`compile`的函数，就可以作为`mili`的Handler。
`compile`函数的具体出入参数如下：

```typescript
interface LoaderOptions {
  [key: string]: any
}

export type Exec<T = LoaderOptions, R = Record<string, any>> = (cwd: string, options: T) => Syncable<R>
```

## 函数的参数说明

 key                |  description
:-------------------|:--------------
 cwd                | 存放项目的文件目录
 options            | 用户配置的参数

## 返回值

返回`resource`对象


## 内置`hadnler`

- [`npm`](./npm.md)
- [`git`](./git.md)
- [`markdown-section`](./markdown-section.md)
