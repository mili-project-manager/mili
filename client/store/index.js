import env from 'detect-env';

import * as MUTATIONS from '../contants/mutations';


export default {
  strict: env.isProd ? false : true,

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

};

