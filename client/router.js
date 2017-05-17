import Vue from 'vue';
import VueRouter from 'vue-router';

import Example from './pages/example';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Example, alias: ['/home'] },
  // { path: '/tests/:filter?', component: Tests, alias: ['/home', '/'] },
  // { path: '/test', component: Test },
  // { path: '/setting', component: Setting },
];

export default new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes,
});
