import Vue from 'vue';
import 'normalize.css';
import 'material-design-icons';

import App from './app';
import router from './router';
import store from './store';
import './styles/index.scss';


export default new Vue({
  el: '#app',
  router,
  store,

  render(h) {
    return h(App);
  },
});
