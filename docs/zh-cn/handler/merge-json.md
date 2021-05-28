# `merge-json` Handler

将模板的文件和使用者项目目录下的同名文件进行合并， 如果文件存在字段冲突，则以模板文件的定义为准。

这个`handler`限制使用者不可以修改模板字段，但是允许其进行自定义额外的字段。

## options

 options           | required | description
:------------------|:---------|:------------------------------------------------
 spaces            | 否       | 要缩进的空格数或用于缩进的字符串。默认值：2

## 示例

```json
[
  {
    "path": ".eslintrc.json",
    "handlers": ["merge-json"]
  },
]
```
