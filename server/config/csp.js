import detectEnv from 'detect-env';

export default detectEnv({
  develop: {
    policy: {
      // Vue need 'unsafe-eval'
      'default-src': ['self', 'unsafe-eval', 'unsafe-inline'],
    },
  },

  staging: {
    policy: {
      // Vue need 'unsafe-eval'
      'default-src': ['self', 'unsafe-eval', 'unsafe-inline'],
    },
  },


  default: undefined,
});
