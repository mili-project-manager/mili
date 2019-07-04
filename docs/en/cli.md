# Command Line Interface

Use `npx mili -h` to see more detials of cli.

## `mili init [options] [repository]`

init project

### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-n --app-name [app_name]` | `basename of cwd` or `progress.cwd()`  | Set application name
 `-v --version [version]`   | latest version                         | Set the template version.
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.

### repository

The repository of template, The supported repository types are:

 repository          | description                           | example
:--------------------|:--------------------------------------|:--------
 `github:owner/name` | Shorthand of github repository. It is equal to https url used to clone | `npx mili init github:Val-istar-Guo/mili-template`
 `npm:package-name`  | The template could be an npm package. Note that some file names will be ignored at the time of publish(e.g. `.gitignore`). | `npx mili init npm:mili-template`
 clone with HTTPS    | Clone template from repository. | `npx mili init https://github.com/Val-istar-Guo/mili-template.git`
 clone with SSH      | Clone template from repository. | `npx mili init git@github.com:Val-istar-Guo/mili-template.git`
 relative path       | Get template from the relative path. It is useful when managing a lot of packages that use a unified template in a repository. (e.g. lerna) The path must begin with `./` or `../`. | `npx mili init ./template/module-template`
 absolute path       | Get template from the absolute path.It is often used for testing | `npx mili ini /template/test-template`

## `mili upgrade [options]`

upgrade your project if then template depended outdated.

### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.
 `-r --recursive`           | -                                      | Upgrade recursive all subfolder.
 `--ignore [file]`          | -                                      | Folders that do not need to be searched when recursively upgrading

## `mili update [options]`

Update your project file with the current version of the template

### options

 option                     | default                                | description
:---------------------------|:---------------------------------------|:--------------
 `-v --version [version]`   | current template version               | Set the template version
 `--cwd [cwd]`              | `progress.cwd()`                       | Set the current work directory
 `--no-deps`                | -                                      | Don't install template dependencies. You can save some time, if don't install dependencies.
 `--force`                  | -                                      | Enforce command. Ignore security check.
 `-r --recursive`           | -                                      | Upgrade recursive all subfolder.
 `--ignore [file]`          | -                                      | Folders that do not need to be searched when recursively upgrading

## `mili clean`

Clean the cache of mili(e.g. cloned template)

## `mili outdated`

Check if the file is out of date

## `mili check [options]`

Verify whether the project file meets the template，`mili check` will compile template according to the `.milirc`.
Then compare the difference between the compilation result and the project file.
If there is a difference, indicates that the current project file content does not meet the template requirements.

`mili check` will not auto fix file.
Because the error of the file content may be caused by the project developer incorrectly modifying the configuration specification or project module.

You can run `mili update` to fix file errors.
Before running, it is recommended to submit the code first or add it to the staging area, so that you can easily review the update differences of the project to ensure the project can working properly.

### options

 option                     | default              | description
:---------------------------|:---------------------|:--------------
 `--cwd [cwd]`              | `progress.cwd()`     | Set the current work directory
 `--no-deps`                | -                    | Don't install template dependencies. You can save some time, if don't install dependencies.
 `-r --recursive`           | -                    | Checking will recursive all subfolder.
 `--ignore [file]`          | -                    | Folders that do not need to be searched when recursively checking.
 `-d --diff`                | `false`              | Show file difference, like `git diff`
 `--fold`                   | `false`              | Fold unchanged code, when show file difference. Used with `--diff`.

## Template version

Template version should be one of:

* semantic version number: Specific template versions
* `'latest'`: The latest template version
* `'default'`: The default files of template or default branch of repository. Used for template development.
