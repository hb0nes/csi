import Vuex from 'vuex'
import Vue from 'vue'
import users from './modules/users'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users
    },
    plugins: [createPersistedState()]
  });