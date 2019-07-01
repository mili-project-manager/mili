# `exist` Handler

If the project file is existed, template file won't rendered. Otherwise render the template file to project.

当`rule.upgrade`为`exist`时，`exist` handler将会被自动加入到`rule.handlers`末尾。

## Example

```javascript
{
  upgrade: `exist`
}
```

或者：

```javascript
{
  handler: 'exist'
}
```

