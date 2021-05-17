# `delete` Handler

删除使用者项目目录中的此文件。

如果不穿任何参数，默认会删除文件

## options

 options           | required | description
:------------------|:---------|:------------------------------------------------
 schema            | 否       | 使用[ajv](https://ajv.js.org/guide/getting-started.html)校验`resource`是否符合`json schema`，若符合则删除。

## 示例

如果`resource.answers.confirm_question`的值为`true`，则删除使用者项目目录的index.js文件

```json
[
  {
    "path": "index.js",
    "handlers": [
      {
        "name": "delete",
        "options": {
          "schema": {
            "type": "object",
            "property": {
              "answers": {
                "type": "object",
                "properties": {
                  "confirm_question": {
                    "type": "boolean",
                    "const": "true"
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
]
```

###### **与`ignore`的区别**：如果用户目录下存在此文件，`ignore`不会删除文件，也不会覆盖文件内容。但是`delete`会删除此文件。
