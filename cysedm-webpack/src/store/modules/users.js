import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const state = {
    status: '',
    user: {}
}

const getters = {
    authStatus: state => state.status,
    isLoggedIn: state => state.status === 'success',
    currentUser: state => {
        return state.user;
    }
}

const actions = {

}

const mutations = {
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, user) {
        state.status = 'success';
        state.user = user;
    },
    auth_error(state) {
        state.status = 'error';
    },
    logout(state) {
        state.status = '';
        state.user = {};
        axios({ method: "GET", withCredentials: true, url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/unstate` }).catch(() => { })
    },
    validate(state) {
        axios({
            method: "post",
            data: {
                user: state.user
            },
            withCredentials: true,
            url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/validate`
        }).catch(() => {
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}