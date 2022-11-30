<template>
  <div id="text" class="text">
    <h4>Login</h4>

    <form class="needs-validation" novalidate>
      <div class="mb-3">
        <label class="form-label" for="loginUsername">Username*</label>
        <input type="text" class="form-control" id="loginUsername" v-model="username" required>
        <div class="invalid-feedback">Please enter username</div>
      </div>

      <div class="mb-3">
        <label  class="form-label" for="loginPassword">Password*</label>
        <input type="password" class="form-control" id="loginPassword" v-model="password" required>
        <div class="invalid-feedback">Please enter password</div>
      </div>

      <button type="submit" class="btn btn-dark" @click="login()">Log In</button>
    </form>
  </div>
</template>

<script>
import '@/assets/css/index.css'
// import userApi from "@/api/user"
// import token from "@/store/token"
import $ from 'jquery'

export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height() + 10, "position": "absolute"
    });

    (function() {
      'use strict';
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
  },
  methods: {
    login() {
      // userApi.login()
      //     .then(response => {
      //       if(response.data.auth === true) {
      //         token.set(response.data.token)
      //         this.$router.push("/")
      //       }
      //     }).catch(error => {
      //   console.log(error)
      // })
    }
  }
}
</script>

<style scoped/>
