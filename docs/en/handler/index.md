# Handler

'handler' is an' object 'composed of two' function '. The structure is:

```typescript
interface Handler {
  genFile: (file: CompiledFile, resource: Readonly<Resource>): Promise<void>
  genPath: (path: string, resource: Readonly<Resource>): Promise<string>
}
```

`mili` run all `genPath` of handlers first, then the `genFile`.
It is beacuse `genFile` may be need to read the project file.

There are two important parameters, `file` and `resource`.Let's to show you how to use them.

## file

By modifying the `file.content`, you can control the file content that is rendered to the project file.
The initial `file.content` is the content of the template file.
And the behavior of rendering 'file' is controlled by `file.delete` and `file.renderable`.

 key                | type                                  | description
:-------------------|:--------------------------------------|:--------------
 content            | `string`                              | The contents will be write to project.
 projectFileExisted | `boolean`                             | Whether the project file exists.
 getProjectContent  | `() => Promise<string>`               | Get the content of project file. Never read file manually, use `getProjectContent` is more secure.
 deleted            | `boolean`                             | Whether to delete file，defaulted `false`.
 renderable         | `boolean`                             | Whether to render file，defaulted`true`.
 addition           | `object`                              | The additional information of file.


## resource

Resource is the read-only data, contains all runtime data.

 key       | type                                  | description
:----------|:--------------------------------------|:--------------
 operation | `'init'` or `'upgrade'` or `'update'` | The operation of cli
 mili      | `object`                              | The information about mili used
 template  | `object`                              | The information about template
 project   | `object`                              | The information about project
 addition  | `object`                              | The addition key-value set by handler(e.g. `extractArea` handler)

### resource.mili

 key       | type                   | description
:----------|:-----------------------|:--------------
 version   | 版本号                  | The version of mili.

### resource.template

 key         | type           | description
:------------|:---------------|:--------------
 path        | `string`       | The folder path of template files that relative to the entry file
 engines     | `string`       | The range of mili version
 files       | `object[]`     | The rule of each file
 hooks       | `object`       | The hook will run on the lifecycle of the mili
 question    | `object[]`     | Relying on [inquirer](https://github.com/SBoudrias/Inquirer.js/) to implement user-defined parameters

### resource.project

 key       | type                        | description
:----------|:----------------------------|:--------------
 path      | `string`                    | The project path
 answers   | `object`                    | The answers of interaction setted in template config

## The build-in `hadnlers`

- exist[./exist.md]
- merge[./merge.md]
- mustache[./mustache.md]
- ignoreWhen[./ignore-when.md]
- extractArea[./extract-area.md]
