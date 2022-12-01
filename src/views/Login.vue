<template>
  <div id="text" class="text">
    <h4>Login</h4>

    <form class="needs-validation" novalidate>
      <div class="mb-3">
        <label class="form-label" for="loginUsername">Username*</label>
        <input type="text" class="form-control" id="loginUsername" v-model="userInfo.username" required>
        <div class="invalid-feedback">Please enter username</div>
      </div>

      <div class="mb-3">
        <label  class="form-label" for="loginPassword">Password*</label>
        <input type="password" class="form-control" id="loginPassword" v-model="userInfo.password" required>
        <div class="invalid-feedback">Please enter password</div>
      </div>

      <button type="button" class="btn btn-dark" @click="login()">Log In</button>
    </form>
  </div>
</template>

<script>
import $ from 'jquery'

import '@/assets/css/index.css'

import userApi from "@/api/user"
import token from "@/store/token"


export default {
  name: "Login",
  data() {
    return {
      userInfo:{
        username:'',
        password:''
      }
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
      userApi.login(this.userInfo)
          .then(response => {
            if(response.data.result === true) {
              token.set(response.data.token)

              this.$message({
                message: response.data.info,
                type: 'success'
              })

              this.$router.push("/")
            }else {
              this.$message({
                message: response.data.info,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message({
              message: 'Something wrong: ' + error,
              type: 'warning'
            })
          })
    }
  }
}
</script>

<style scoped/>
