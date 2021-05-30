# `markdown-section` Loader

从Markdown文件中提取两个`<!-- ${section_name} -->`注释之间的内容

使用Loader配合`handlebars` Handler进行模板渲染，可以保证`readme.md`一类的markdown文件符合模板的格式规范。您可以用于：

* 限制Markdown文件有一致的页头和页脚
* 生成一致的shields标签美化README.md文件

## 参数

 option     | required | description
:-----------|:---------|:------------------------
 `key`      | 是       | 指定提取的数据存放入`resource`的键值
 `sections` | 是       | 需要地区的`section`名称
 `filepath` | 是       | 文件路径
 `encoding` | 否       | 文件编码，默认`'utf8'`


## Resource Example

假设我们项目中有如下`readme.md`文件

```markdown
# Title

<!-- description -->The Description<!-- description -->

# Footer

The Footer
```

Loader 配置如下：

```json
{
  "loaders": [
    {
      "name": "markdown-section",
      "options": {
        "key": "readme",
        "sections": ["description"],
        "filepath": "readme.md",
        "encoding": "utf8"
      }
    }
  ]
}
```

将得到`resource`：

```
{
  "readme": {
    "description": "The Description"
  }
}
```

