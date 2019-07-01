# `extract-area` Handler

Extract the text between two `tags` from the content of project,
and set text to `file.content`.

## Example


```javascript
{
  handlers: [
    buildInHandlers => buildInHandlers.extractArea('description', '<!-- description -->')
  ]
}
```

If the content of project is:

```markdown
// content of project
# Example

<!-- description -->The text area<!-- description -->
```

You will get `'The text area'` from `file.addition.description`
