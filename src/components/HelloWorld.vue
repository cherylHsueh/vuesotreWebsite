<template>
  <div class="hello">
    <a href="#" @click="signout">登出</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
    }
  },
  methods: {
    signout(){
        const api = `${process.env.VUE_APP_API}/logout`
				const vm = this
				this.$http.post(api).then((response) => {
					console.log(response.data)
					//如果成功就導到登入頁面
					if(response.data.success){
						vm.$router.push('/login')
					}
				})
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
