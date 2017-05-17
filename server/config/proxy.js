export default {
  host: 'http://miaooo.me:8002',
  match: /^\/api\/.*/,
  map: url => url.replace(/^\/api/, ''),
};
