import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import register from '@/components/Register'
import forgot from '@/components/Forgot'
import notFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
<<<<<<< HEAD
      path: '*',
      redirect: { name: 'notfound' }
=======
      path: '/',
      redirect: { name: 'login' }
>>>>>>> 9bf394f29a3dfd34f17ac4756f0bcdfa128d761a
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
  ]
})
