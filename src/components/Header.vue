<template>
  <header id="header" class="header">
    <span id="main-title" class="main-title">Irish Rail</span>
    <span v-if="path === '/'"> Home Page</span>
    <span v-if="path === '/login'"> Login</span>
    <span v-if="path === '/signup'"> Sign Up</span>
    <span v-if="path === '/map'"> Map</span>
    <span v-if="path === '/update-profile'"> Update Profile</span>
    <span v-if="path === '/change-password'"> Change Password</span>

    <div style="float: right" class="dropdown" v-if="auth">
      <button class="btn btn-secondary" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa fa-bars"></i>
      </button>

      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button v-if="path !== '/'" id="show-home-page" class="dropdown-item" @click="toHome">Home</button>
        <button v-if="path !== '/map'" id="show-map-page" class="dropdown-item valid-user" @click="toMap">Map</button>
        <button v-if="path !== '/update-profile'" id="show-change-user-page" class="dropdown-item valid-user" @click="toUpdateProfile">Update Profile</button>
        <button v-if="path !== '/change-password'" id="show-change-password-page" class="dropdown-item valid-user" @click="toChangePassword">Change Password</button>
        <button id="show-logout" class="dropdown-item valid-user" @click="logout">Log Out</button>
      </div>
    </div>

    <div style="float: right; padding: 0.5rem; font-size: initial" class="sp-username" v-if="auth">{{ username }}</div>

    <div style="float: right" class="dropdown" v-if="!auth">
      <button class="btn btn-secondary" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa fa-bars"></i>
      </button>

      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button v-if="path !== '/'" id="show-home-page" class="dropdown-item" @click="toHome">Home</button>
        <button v-if="path !== '/login'" id="show-login-page" class="dropdown-item no-user" @click="toLogin">Login</button>
        <button v-if="path !== '/signup'" id="show-signup-page" class="dropdown-item no-user" @click="toSignup">Sign up</button>
      </div>
    </div>
  </header>
</template>

<script>
import token from "@/store/token";

import userApi from "../api/user"

import '@/assets/css/index.css'


export default {
  name: "Header",
  data() {
    return {
      path: '',
      username: '',
      auth: false
    }
  },
  created() {
    this.path = this.$route.path
    this.initial()
  },
  // listen for url change
  watch: {
    $route: {
      handler() {
        this.path = this.$route.path
        this.initial()
      }
    }
  },
  methods: {
    // use for auto logout
    initial() {
      if(token.get() === null) {
        this.auth = false
        this.username = ''
      }else {
        this.auth = true
        this.username = token.getUser()
      }
    },
    // logout function
    logout() {
      userApi.logout()
          .then(response => {
            if(response.data.result === true) {
              // clear token, username and set auth to false
              token.clear()
              this.username = ''
              this.auth = false

              this.$message({
                message: response.data.info,
                type: 'success'
              })

              // back to main page
              if(this.path !== '/') this.$router.push("/")
            }
          }).catch(error => {
            if(error.response.status === 403) {
              this.$message({
                message: 'Token does not provided, logged out',
                type: 'error'
              })
            }else {
              this.$message({
              message: error.response.data.info,
              type: 'error'
              })
            }

            // clear token, username and set auth to false
            token.clear()
            this.username = ''
            this.auth = false

            // back to main page
            if(this.path !== '/') this.$router.push("/")
          })
    },
    toHome() {
      this.$router.push({ path: '/' })
    },
    toLogin() {
      this.$router.push({ path: '/login' })
    },
    toSignup() {
      this.$router.push({ path: '/signup' })
    },
    toMap() {
      this.$router.push({ path: '/map' })
    },
    toUpdateProfile() {
      this.$router.push({ path: '/update-profile' })
    },
    toChangePassword() {
      this.$router.push({ path: '/change-password' })
    }
  }
}
</script>

<style scoped/>
