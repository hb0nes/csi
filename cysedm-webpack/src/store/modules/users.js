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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}