import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import Router from 'vue-router'
import store from './store'
import VueSocketio from 'vue-socket.io';

// HTTP calls
Vue.use(VueAxios, axios)
// Validation
Vue.use(Vuelidate)
// Routing
Vue.use(Router)
// Socket.IO
Vue.use(VueSocketio, `${process.env.VUE_APP_SERVERNAME}:3000`);
Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  // Include the store declaration
  store,
  render: h => h(App)//,
}).$mount('#app')
