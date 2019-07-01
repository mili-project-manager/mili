# `ignore-when` Handler

No render the file when meet certain conditions.

`ignoreWhen(resource => resource.operation !== 'init')` will be auto added at the last of handlers, when `rule.upgrade` is `exist`.

## Example

```javascript
{
  handlers: [
    buildInHandler => buildInHandler.ignoreWhen(resource => resource.operation !== 'init')
  ]
}
```
