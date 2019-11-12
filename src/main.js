import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

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
  if(to.meta.requiresAuth){
    //不放行
    console.log('這裡需要驗證')
    const api = `${process.env.VUE_APP_API}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data)
      //如果成功就導到登入頁面
      if(response.data.success){
        next()
        // vm.$router.push('/')
      }
    })
  }
  else{
    //直接放行
    next({
      path:'/login'
    })
  }
  
})