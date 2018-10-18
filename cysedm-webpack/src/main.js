import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import Router from 'vue-router'
import store from './store'

// HTTP calls
Vue.use(VueAxios, axios)
// Validation
Vue.use(Vuelidate)
// Routing
Vue.use(Router)
// Datastore
Vue.use(Vuex)


Vue.config.productionTip = false

new Vue({
  // Include the store declaration
  store,
  render: h => h(App),
  // Create a response 401 interceptor that calls the store logout method
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout)
        }
        throw err;
      });
    });
  }
}).$mount('#app')
