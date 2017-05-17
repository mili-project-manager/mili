import detectEnv from 'detect-env';

export default detectEnv({
  production: undefined,

  default: {
    policy: {
      // Vue need 'unsafe-eval'
      'default-src': ['self', 'unsafe-eval', 'unsafe-inline'],
    },
  },
});
