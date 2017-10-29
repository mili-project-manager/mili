import env from 'detect-env';

import * as MUTATIONS from '../contants/mutations';
import { FETCH_STATUS } from '../contants/status';


const fetch = () => new Promise(resolve => setTimeout(resolve, 4000)) ;

export default {
  strict: env.isProd ? false : true,

  modules: {
  },

  state: {
    isload: false,
    value: '',
  },

  actions: {
    fetchValue: async ({ state, commit }, payload) => {
      // needless dispatch
      // if (state.value === payload) return;

      console.log('fetching value', payload);
      commit(MUTATIONS.UPDATE_FETCH_STATE, FETCH_STATUS.FETCHING);
      await fetch();
      console.log('fetched value', payload);
      commit(MUTATIONS.UPDATE_FETCH_STATE, FETCH_STATUS.FETCHED);
      commit(MUTATIONS.UPDATE_VALUE, payload);
    }
  },

  mutations: {
    [MUTATIONS.UPDATE_VALUE](state, payload) {
      state.value = payload;
    },
    [MUTATIONS.UPDATE_FETCH_STATE](state, payload) {
      state.isload = payload === FETCH_STATUS.FETCHED;
    },
  },

};

