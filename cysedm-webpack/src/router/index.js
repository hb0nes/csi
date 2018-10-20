import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import register from '@/components/Register'
import forgot from '@/components/Forgot'
import home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: { name: 'login' }
    },
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: forgot
    },
    {
      path: '/home',
      name: 'home',
      component: home
    }
  ]
})