import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router'

 
Vue.use(VueAxios, axios, Router)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
