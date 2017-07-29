import Vue from 'vue';
import VueRouter from 'vue-router';

import Example from './pages/example';


Vue.use(VueRouter);

const routes = [
  { path: '/', component: Example, alias: ['/home'] },
];

export default new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  routes,
});

