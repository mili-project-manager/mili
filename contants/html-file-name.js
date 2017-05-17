import detectEnv from 'detect-env';


export default detectEnv({
  production: 'index.prod.html',
  default: 'index.dev.html',
});
