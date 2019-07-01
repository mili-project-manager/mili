# `merge` Handler

This handler merge the `file.content` and the content of project file to produce new `file.content`.
It will be auto added at the last of handlers, when `rule.upgrade` is `merge`.

The supported file formats are `.json`, `.yaml`, `.yml`, `.gitignore` and `.npmignore`.


## Example

```javascript
{
  upgrade: `merge`
}
```

or

```javascript
{
  handler: 'merge'
}
```

