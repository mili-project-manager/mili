import Vue from 'vue';
import Vuex from 'vuex';
import detectEnv from 'detect-env';

import * as MUTATIONS from '../contants/mutations';


Vue.use(Vuex);

const store = new Vuex.Store({
  strict: detectEnv({ production: false, default: true }),

  modules: {
  },

  state: {
    time: { server: new Date().getTime(), client: new Date().getTime() },
  },

  getters: {
    serverTime: ({ time }) => {
      const now = new Date().getTime();

      return new Date(now - time.client + time.server);
    }
  },

  mutations: {
    [MUTATIONS.UPDATE_SERVER_TIME](state, payload) {
      state.time = {
        server: payload.serverTime,
        client: new Date().getTime(),
      };
    },
  },
});

export default store;
