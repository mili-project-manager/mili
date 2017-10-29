import 'normalize.css';
import Vue from 'vue';

import App from './app';
import createRouter from './createRouter';
import createStore from './createStore';
import './styles/index.scss';
import './components';


export default function () {

  const router = createRouter();
  const store = createStore();

  const app = new Vue({
    router,
    store,
    render: (h) =>h(App),
  });

  return { app, store, router };
}

