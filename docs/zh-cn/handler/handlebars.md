# `handlebars` Handler


使用[handlebars](https://handlebarsjs.com/)渲染模板文件，
`Resource`会作为渲染使用的数据视图。
并且会自动删除文件的`.hbs`文件扩展名。


## 示例

```json
[
  {
    "path": ".milirc.yml.hbs",
    "handlers": ["handlebars"]
  },
]
```
