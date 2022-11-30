<template>
  <header id="header" class="header">
      <span>AWM 2022/23</span>
      <span v-if="path === '/'"> Home Page</span>
      <span v-if="path === '/login'"> Login</span>
      <span v-if="path === '/signup'"> Sign Up</span>
<!--  {% if user.is_authenticated %}-->
<!--  <div style="float: right" class="dropdown">-->
<!--    <button class="btn btn-secondary" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
<!--      <i class="fa fa-bars"></i>-->
<!--    </button>-->

<!--    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">-->
<!--      <a id="show-home-page" class="dropdown-item" href={% url 'home' %}>Home</a>-->
<!--      <a id="show-map-page" class="dropdown-item valid-user" href={% url 'map' %}>Map</a>-->
<!--      <a id="show-change-user-page" class="dropdown-item valid-user" href={% url 'updateProfile' %}>Update Profile</a>-->
<!--      <a id="show-change-password-page" class="dropdown-item valid-user" href={% url 'changePassword' %}>Change Password</a>-->
<!--      <a id="show-logout" class="dropdown-item valid-user" href={% url 'logout' %}>Log Out</a>-->
<!--    </div>-->
<!--  </div>-->

<!--  <div style="float: right; padding: 0.5rem; font-size: initial" class="sp-username">{{ request.user }}</div>-->
<!--  {% else %}-->
    <div style="float: right" class="dropdown">
      <button class="btn btn-secondary" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa fa-bars"></i>
      </button>

      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button v-if="path !== '/'" id="show-home-page" class="dropdown-item" @click="home">Home</button>
        <button v-if="path !== '/login'" id="show-login-page" class="dropdown-item no-user" @click="login">Log In</button>
        <button v-if="path !== '/signup'" id="show-signup-page" class="dropdown-item no-user" @click="Signup">Sign Up</button>
      </div>
    </div>
  </header>
</template>

<script>
import token from "@/store/token";

import userApi from "../api/user"

export default {
  name: "Header",
  data() {
    return {
      path: ''
    }
  },
  created() {
    this.path = this.$route.path
  },
  watch: {
    $route: {
      handler() {
        this.path = this.$route.path
      }
    }
  },
  methods: {
    logout() {
      userApi.logout()
          .then(response => {
            if(response.data.logout === true) {
              token.clear()
              this.$router.push("/");
            }
          }).catch(error => {
            console.log(error)
          })
    },
    home() {
      this.$router.push({ path: '/' })
    },
    login() {
      this.$router.push({ path: '/login' })
    },
    Signup() {
      this.$router.push({ path: '/signup' })
    }
  }
}
</script>

<style scoped/>
