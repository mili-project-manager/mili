# `exist` Handler

If the project file is existed, template file won't rendered. Otherwise render the template file to project.

It will be auto added at the last of handlers, when `rule.upgrade` is `exist`.

## Example

```javascript
{
  upgrade: `exist`
}
```

or

```javascript
{
  handler: 'exist'
}
```

