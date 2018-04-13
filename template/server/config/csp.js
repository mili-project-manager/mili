import env from 'detect-env';

export default env.detect({
  prod: undefined,

  default: {
    policy: {
      // Vue need 'unsafe-eval'
      'default-src': ['self', 'unsafe-eval', 'unsafe-inline', 'ws:'],
    },
  },
});
