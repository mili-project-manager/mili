// PM2 Config
const { join } = require('path')


const { name: APP_NAME, repository: REPO, deploy = {} } = require('./package.json')
let { user, host, port, path, prod, dev } = deploy

if (!(
  (prod.user || user) && (prod.host || host) && (prod.port || port) && (pord.path || path) &&
  (dev.user || user) && (dev.host || host) && (dev.port || port)  && (dev.path || path)
)) {
  throw new Error('package.deploy should be be set correctly, please check your package.json')
}

module.exports = {
  apps: [
    {
      name: `${APP_NAME}-dev`,
      script: './dist/server/bundle.js',
      source_map_support: true,

      env_dev: {
        PORT: dev.port || port,
      },
    },
    {
      name: `${APP_NAME}-prod`,
      script: './dist/server/bundle.js',

      env_prod: {
        PORT: prod.port || port,
      },
    },
  ],

  deploy: {
    prod: {
      user,
      host,
      ref: 'origin/master',
      repo: REPO,
      path: prod.path || path,
      'post-deploy': `npm i; npm run build:prod; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME}-prod --env prod`,

      env: { NODE_ENV: 'prod' },
    },
    dev: {
      user,
      host,
      ref: 'origin/dev',
      repo: REPO,
      path: dev.path || path,
      'post-deploy': `npm i; npm run build:prod; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME}-dev --env dev`,
      env: { NODE_ENV: 'dev' },
    },
  },
}
