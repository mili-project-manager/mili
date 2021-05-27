<!-- title -->
<p align="center" style="padding-top: 40px">
  <img src="./docs/images/logo.svg?sanitize=true" width="120" alt="logo" />
</p>

<h1 align="center" style="text-align: center">Mili</h1>
<!-- title -->

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![license](https://img.shields.io/npm/l/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/mili-project-manager/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![coveralls](https://img.shields.io/coveralls/github/mili-project-manager/mili.svg?style=flat-square)](https://coveralls.io/github/mili-project-manager/mili)



<!-- description -->
[简体中文](./docs/zh-cn/readme.md)

**Projects that derived from the same scaffolding, have evolved over time and become different.**
Scaffolding lost control of the subsequent development of the project.
When we need to improve some of the basic functions of scaffolding(e.g. eslint rules), we need to modify each project, and even have to design a customized solution for some old projects.

Therefore, in order to improve the control ability of scaffolding for the subsequent development of the project,template can modified some files and release new template version, then project can upgrade the template version.

It is useful for team project management.
<!-- description -->

## Usage

<!-- usage -->
### Init Project

```shell
mkdir my_project
cd my_project

# template in npm
npx mili init npm:@mtpl/code-style
# template in github
npx mili init github:mili-project-manager/mtpl-code-style
# template in private git repository
npx mili init https://github.com/mili-project-manager/mtpl-code-style
# ssh is also support
npx mili init git@github.com:mili-project-manager/mtpl-code-style.git
```

### Upgrade

The upgrade operation is very simple to use.
It will upgrade the template to the latest version.

```shell
npx run upgrade
```

###### This command maybe overwrite your files.


### Check Before Commit

With [husky](https://www.npmjs.com/package/husky),
it is easy to verify whether the project file meets the template before commit.
Thereby ensuring the specification of the project code.

Run in terminal:
```shell
npx mili check --diff --fold
```

The example stdout:

![mili check](./docs/images/check.png)

Run `npx mili upgrade` command will auto modify code according to the diff.
<!-- usage -->

<!-- addition -->
<!-- addition -->

## Sponsor

Support code development on patron.

[![patron](https://c5.patreon.com/external/logo/become_a_patron_button@2x.png)](https://www.patreon.com/bePatron?u=22478507)

## Contributing & Development

If there is any doubt, it is very welcome to discuss the issue together.
Please read [Contributor Covenant Code of Conduct](.github/CODE_OF_CONDUCT.md) and [CONTRIBUTING](.github/CONTRIBUTING.md).
