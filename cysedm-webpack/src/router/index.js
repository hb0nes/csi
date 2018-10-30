import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import register from '@/components/Register'
import forgot from '@/components/Forgot'
import notFound from '@/components/NotFound'
import messages from '@/components/Messages'
import reset from '@/components/Reset'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // Hoe gaan we dit doen?? Met redirect werkt forgot password niet meer
      // redirect: { name: 'login' }
      name: 'login',
      component: login

    },
    {
      path: '*',
      component: notFound
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
      path: '/messages',
      name: 'messages',
      component: messages
    },
    {
      path: '/reset/:id/:token',
      name: 'reset',
      component: reset,
      props: true
    },
  ]
})
