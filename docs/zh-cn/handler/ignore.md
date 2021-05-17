# `ignore` Handler

不渲染模板文件，如果使用者项目中存在同名文件，也不会删除此文件。

如果不传任何参数，默认会不渲染文件

## 参数

 options           | required | description
:------------------|:---------|:--------------------
 schema            | 否       | 使用[ajv](https://ajv.js.org/guide/getting-started.html)校验`resource`是否符合`json schema`，若符合则不渲染。

## 示例

如果`resource.answers.confirm_question`的值为`true`，则不渲染`index.js`文件

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
