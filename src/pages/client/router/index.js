import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '@/views/login/user-login'
import Register from '@/views/register/register'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/user'
    },
    {
      path: '/user',
      component: UserLogin
    },
    {
      path: '/register',
      component: Register
    },
  ],
  mode: 'history'
})

// 挂载路由导航守卫


export default router
