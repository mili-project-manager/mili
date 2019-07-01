# `mustache` Handler

将`file.content`作为模版，并将`file.addition`与`resource`合并成`view`，通过[mustache](https://github.com/janl/mustache.js)，渲染出新的`file.content`。

`view`的结构如下：

```javascript
{
  mili: resource.mili,
  project: resource.project,
  template: resource.template,
  answers: resource.answers,
  addition: file.addition,
}
```


## 示例

```javascript
{
  handler: 'mustache',
}
```
