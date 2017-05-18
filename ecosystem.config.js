// PM2 Config
const path = require('path');
const { name: APP_NAME } = require('./package.json');

module.exports = {
  apps: [
    {
      name: 'dev-app',
      script: './bin/server.dev.js',
      watch: ['server', 'webpack', 'bin'],
      source_map_support: true,

      env: {
        NODE_ENV: 'develop',
      },
    },
    {
      name: `${APP_NAME}-staging`,
      script: './bin/server.dev.js',
      source_map_support: true,

      env: {
        NODE_ENV: 'staging',
      },
      env_staging: {
        PORT: 7001,
      },
    },
    {
      name: APP_NAME,
      script: './dist/server/bundle.js',

      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        PORT: 9001,
      },
    },
  ],

  deploy: {
    prod: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/master',
      repo: 'https://github.com/Val-istar-Guo/vue-boilerplate.git',
      path: path.join('/home/docker', APP_NAME, 'production'),
      'post-deploy': `yarn; npm run build:prod; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME} --env production`,

      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/dev',
      repo: 'https://github.com/Val-istar-Guo/vue-boilerplate.git',
      path: path.join('/home/docker', APP_NAME, 'staging'),
      'post-deploy': `yarn; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME}-staging --env staging`,
    },

    env: {
      NODE_ENV: 'staging',
    },
  },
};
