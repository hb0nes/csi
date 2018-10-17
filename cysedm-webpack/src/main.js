import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
 
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
