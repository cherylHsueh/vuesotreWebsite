import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'HelloWorld',
    component:()=>import('../components/HelloWorld.vue'),
    meta: { requiresAuth: true } //路由訊息，判斷基準
  },
  {
    path:'/login',
    name:'Login',
    component:()=> import('../components/pages/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_API,
  routes
})

export default router
