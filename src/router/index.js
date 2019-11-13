import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'*',
    redirect:'login'
  },
  // {
  //   path:'/',
  //   name:'HelloWorld',
  //   component:()=>import('../components/HelloWorld.vue'),
  //   meta: { requiresAuth: true } //路由訊息，判斷基準
  // },
  {
    path:'/login',
    name:'Login',
    component:()=> import('../components/pages/Login.vue')
  },
  {
    path:'/admin',
    name:'Dashboard',
    component:()=>import('../components/Dashboard.vue'),
    meta: { requiresAuth: true }, //路由訊息，判斷基準
    children:[
      {
        path:'Products',
        name:'Products',
        component:()=>import('../components/pages/Products.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
