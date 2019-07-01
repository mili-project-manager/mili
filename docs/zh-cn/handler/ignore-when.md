# `ignore-when` Handler

当满足某种条件时，不渲染模版文件。

当`rule.upgrade`为`exist`时，`ignoreWhen(resource => resource.operation !== 'init')` 将会被自动加入到`rule.handlers`末尾。

## 示例

```javascript
{
  handlers: [
    buildInHandler => buildInHandler.ignoreWhen(resource => resource.operation !== 'init')
  ]
}
```
