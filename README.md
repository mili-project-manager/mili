# MILI

[![version](https://img.shields.io/npm/v/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![downloads](https://img.shields.io/npm/dm/mili.svg?style=flat-square)](https://www.npmjs.com/package/mili)
[![dependencies](https://img.shields.io/david/expressjs/express.svg)](https://www.npmjs.com/package/mili)


## Install

```bash
// init an website
npx mili init

// init an component
npx mili init -t component
```

## Usage

### mili init [option] [app_name]

initial your project.
if you don't set `app_name`, it will use the name of the current folder.
by default, mili will init an website project， unless you set the `-t` or `--type`


|   option   |      enum      | default | description |
|:----------:|----------------|---------|-------------|
| -t --type  | web, component | web     | Which app type to build?


### mili upgrade

upgrade your project

## Technology Stack

- vue
-  - vuex
-  - vue-router
-  - vue-server-renderer
- koa
-  - koa-router
-  - koa-logger
-  - koa-proxy
-  - koa-static
-  - koa-views
- superagent
- chalk
- webpack
- babel
- pm2
