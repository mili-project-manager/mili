# `merge` Handler

将`file.content`与项目文件内容合并，生成新的`file.content`。

当`rule.upgrade`为`merge`时，`merge` handler将会被自动加入到`rule.handlers`末尾。

Handler 目前支持的格式有：`.json`, `.yaml`, `.yml`, `.gitignore`, `.npmignore` 和 `.babelrc`.

## 示例

```javascript
{
  upgrade: `merge`
}
```

或者：

```javascript
{
  handler: 'merge'
}
```
