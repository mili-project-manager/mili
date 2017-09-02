// PM2 Config
const path = require('path');
const { name: APP_NAME, repository: REPO } = require('./package.json');

module.exports = {
  apps: [
    {
      name: 'dev-app',
      script: './build/server.dev.js',
      watch: ['./server', './build', './framework'],
      source_map_support: true,

      env: {
        NODE_ENV: 'develop',
      },
    },
    {
      name: `${APP_NAME}-stage`,
      script: './dist/server/bundle.js',
      source_map_support: true,

      env: {
        NODE_ENV: 'stage',
      },
      env_stage: {
        PORT: 7001,
      },
    },
    {
      name: `${APP_NAME}-prod`,
      script: './dist/server/bundle.js',

      env: {
        NODE_ENV: 'prod',
      },
      env_prod: {
        PORT: 9001,
      },
    },
  ],

  deploy: {
    prod: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/master',
      repo: REPO,
      path: path.join('/home/docker', APP_NAME, 'prod'),
      'post-deploy': `yarn; npm run build:prod; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME}-prod --env prod`,

      env: {
        NODE_ENV: 'prod',
      },
    },
    stage: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/dev',
      repo: REPO,
      path: path.join('/home/docker', APP_NAME, 'stage'),
      'post-deploy': `yarn; npm run build:prod; pm2 startOrRestart ecosystem.config.js --only ${APP_NAME}-stage --env stage`,
    },

    env: {
      NODE_ENV: 'stage',
    },
  },
};
