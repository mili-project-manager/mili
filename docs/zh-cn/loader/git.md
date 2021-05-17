# `git` Loader

加载使用者项目`git`信息

## 参数

 option    | required | description
:----------|:---------|:------------------------
 `remote`  | 否       | 读取项目的哪个`remote`作为仓库地址，如果不穿则会取`git remote`命令列出的第一个`remote`地址

## Resource Example

```json
{
  "repository": {
    "isRepo": true,
    "isGitHubRepo": true,
    "url": "https://github.com/mili-project-manager/mili.git",
    "gitHubOwner": "mili-project-manager",
    "gitHubRepoName": "mili"
  }
}
```
