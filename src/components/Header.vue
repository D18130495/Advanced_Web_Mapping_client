<template>
  <div>
    <span>AWM 2022/23</span>
  </div>
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
<!--  <div style="float: right" class="dropdown">-->
<!--    <button class="btn btn-secondary" role="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
<!--      <i class="fa fa-bars"></i>-->
<!--    </button>-->

<!--    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">-->
<!--      <a id="show-home-page" class="dropdown-item" href={% url 'home' %}>Home</a>-->
<!--      <a id="show-login-page" class="dropdown-item no-user" href={% url 'login' %}>Log In</a>-->
<!--      <a id="show-signup-page" class="dropdown-item no-user" href={% url 'signup' %}>Sign Up</a>-->
<!--    </div>-->
<!--  </div>-->
<!--  {% endif %}-->
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped/>
