import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import Router from 'vue-router'

// HTTP calls
Vue.use(VueAxios, axios)
// Validation
Vue.use(Vuelidate)
// Routing
Vue.use(Router)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
