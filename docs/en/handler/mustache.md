# `mustache` Handler

This handler use the `file.content` as the template, and create new view that combines `file.addition` and `resource`, render the new `file.content` with the [mustache](https://github.com/janl/mustache.js).

The view is:

```javascript
{
  mili: resource.mili,
  project: resource.project,
  template: resource.template,
  answers: resource.answers,
  addition: file.addition,
}
```


## Example

```javascript
{
  handler: 'mustache',
}
```
