import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import '@fortawesome/fontawesome-free/css/all.css'
import  './style/main.scss'

import App from './App.vue'
import router from './router'
import store from './store'
import './bus'
import currencyFilter from './filters/currency'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.component('Loading',Loading)
Vue.filter('currency',currencyFilter)

//加入這段後， 有一段後端傳來的session，session就會把這一段存在前端，每次vue在發送API時，就會幫你把這段session自動帶存在你的cookie裡。在你每次發送api時，他也會自動帶往後端送。
axios.defaults.withCredentials = true // default

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//導航守衛
//meta是路由訊息
router.beforeEach((to, from, next) => {
  // console.log('to',to,'from',from,'next',next);
  if(!to.meta.requiresAuth){
    //直接放行
    next()
  }
  else{
    //不放行
    const api = `${process.env.VUE_APP_API}/api/user/check`
    axios.post(api).then((response)  =>{
      console.log('response.data',response.data);
      //如果失敗就導到登入頁面
      if(!response.data.success){
        next({
          path:'/login'
        })
        return
      }
      //如果成功就導到登入頁面
      next()
    })
  }
})