import Vuex from 'vuex'
import Vue from 'vue'
import users from './modules/users'
import axios from 'axios'
import VueAxios from 'vue-axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(VueAxios, axios);
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users
    },
    plugins: [createPersistedState()]
  });