# VUE-KOA BOILERPLATE

## 技术栈

- vue
  - vuex
  - vue-router
  - vue-server-renderer
- koa
  - koa-router
  - koa-logger
  - koa-proxy
  - koa-static
  - koa-views
- superagent
- chalk
- webpack
- babel
- pm2

## Introduction

Reference linking: [Vue-Koa 同构开发环境](http://miaooo.me/article/Vue-Koa%E5%90%8C%E6%9E%84%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83)

## NPM Script

### npm start

Run app at development environment.


### npm run start:prod

Run app at product environment

### npm run clean

Delete files under dist floder

### npm run setup

pm2 setup before first deploy

### npm run deploy

Deploy to stage

### npm run deploy:prod

Deploy to prodction

### npm run analyzer

analyzer your app's bundled modules in a production env. See Also: [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

