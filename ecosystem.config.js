// PM2 Config

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
      name: 'staging-app',
      script: './bin/server.dev.js',
      source_map_support: true,

      env: {
        NODE_ENV: 'develop',
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 8001,
      },
    },
    {
      name: 'app',
      script: './dist/server/bundle.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    prod: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/master',
      repo: 'https://github.com/Val-istar-Guo/ab_test_config_server.git',
      path: '/home/docker/app/production',
      'post-deploy': 'yarn && npm run build && pm2 startOrRestart ecosystem.config.js --only abtest-config-server --env production',
    },
    staging: {
      user: 'docker',
      host: 'docker',
      ref: 'origin/dev',
      repo: 'https://github.com/Val-istar-Guo/ab_test_config_server.git',
      path: '/home/docker/app/staging',
      'post-deploy': 'yarn; pm2 startOrRestart ecosystem.config.js --only dev-abtest-config-server --env staging',
    },
  },
};
