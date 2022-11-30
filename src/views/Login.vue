<template>
  <div id="text" class="text">
    This is login
  </div>
</template>

<script>
import '@/assets/css/index.css'
import userApi from "@/api/user"
import token from "@/store/token"

export default {
  name: "Login",
  data() {
    return {
      path: ''
    }
  },
  created() {
  },
  methods: {
    login() {
      userApi.login()
          .then(response => {
            if(response.data.auth === true) {
              token.set(response.data.token)
              this.$router.push("/")
            }
          }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped/>
