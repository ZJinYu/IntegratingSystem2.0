import Vue from 'vue'
import VueRouter from 'vue-router'
import AdminLogin from '@/views/login/admin-login'
import Index from '@/views/home'
import Initialize from '@/components/initialize/initialize'
import UserInfo from '@/views/user/userinfo'
import AdminInfo from '@/views/admin/admininfo'
import Card from '@/views/card/card'
import GoodsList from '@/views/goods/goodsList'
import GoodsClass from '@/views/goods/goodsClass'
import OrderInfo from '@/views/order/orderinfo'
import Changepwd from '@/views/admin/changepwd'
import Rule from '@/views/rule/rule'
import Banner from '@/views/banner/banner'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    {
      path: '/admin',
      component: AdminLogin
    },
    {
      path: '/index',
      component: Index,
      redirect: '/initialize',
      children: [
        {
          path: '/initialize',
          component: Initialize
        },
        {
          path:'/admininfo',
          component: AdminInfo
        },
        {
          path:'/changepwd',
          component: Changepwd
        },
        {
          path: '/userinfo',
          component: UserInfo
        },
        {
          path:'/goodsClass',
          component: GoodsClass
        },
        {
          path:'/goodsList',
          component: GoodsList
        },
        {
          path:'/card',
          component: Card
        },
        {
          path:'/orderinfo',
          component: OrderInfo
        },
        {
          path:'/rule',
          component: Rule
        },
        {
          path:'/banner',
          component:Banner
        }
      ]
    },
  ],
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/admin') return next()
  const tokenStr = localStorage.getItem('token')
  console.log(tokenStr);
  if(!tokenStr) return  next('/admin')
  next()
})

export default router
