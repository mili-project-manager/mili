# `extract-area` Handler

从项目文件内容中提取两个标记之间的内容。并将提取的内容放入`file.addition`。

## 示例


```javascript
{
  handlers: [
    buildInHandlers => buildInHandlers.extractArea('description', '<!-- description -->')
  ]
}
```

如果项目文件的内容如下：

```markdown
// content of project
# Example

<!-- description -->The text area<!-- description -->
```

你可以从`file.addition.description`中取得`'The text area'`。
