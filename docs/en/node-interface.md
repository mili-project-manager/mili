# Node Interface

Mili provides a Node.js API which can be used directly in Node.js runtime.

```javascript
import mili from 'mili'

mili.init({ repository })
mili.upgrade()
mili.update()
mili.outdated()
mili.clean()
```

## `mili.init(options)`

 option      | default                               | description
:------------|:--------------------------------------|:--------------
 *repository | -                                     | The repository path. [see more](./cli.md#repository)
 name        | `basename of cwd` or `progress.cwd()` | Set application name
 version     | `latest version`                      | Set the template version
 cwd         | `progress.cwd()`                      | Set the current work directory
 noDeps      | `false`                               | Don't install template dependencies. You can save some time, if don't install dependencies.
 force       | `false`                               | Enforce command. Ignore security check.

## `mili.upgrade(options)`

 option     | default          | description
:-----------|:-----------------|:--------------
 cwd        | `progress.cwd()` | Set the current work directory
 noDeps     | `false`          | Don't install template dependencies. You can save some time, if don't install dependencies.
 force      | `false`          | Enforce command. Ignore security check.
 recursive  | `false`          | Upgrade recursive all subfolder.
 ignore     | `[]`             | Folders that do not need to be searched when recursively upgrading

## `mili.update(options)`

 option     | default                  | description
:-----------|:-------------------------|:--------------
 version    | current template version | Set the template version
 cwd        | `progress.cwd()`         | Set the current work directory
 noDeps     | `false`                  | Don't install template dependencies. You can save some time, if don't install dependencies.
 force      | `false`                  | Enforce command. Ignore security check.
 recursive  | `false`                  | Upgrade recursive all subfolder.
 ignore     | `[]`                     | Folders that do not need to be searched when recursively upgrading

## `mili.outdated(options)`

 option  | default                  | description
:--------|:-------------------------|:--------------
 cwd     | `progress.cwd()`         | Set the current work directory

## `mili.clean()`

No options.

## `mili.check(options)`

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`     | Set the current work directory
 `--no-deps`                | -                    | Don't install template dependencies. You can save some time, if don't install dependencies.
 `-r --recursive`           | -                    | Checking will recursive all subfolder.
 `--ignore [file]`          | -                    | Folders that do not need to be searched when recursively checking.
 `-d --diff`                | `false`              | Show file difference, like `git diff`
 `--fold`                   | `false`              | Fold unchanged code, when show file difference. Used with `--diff`.
