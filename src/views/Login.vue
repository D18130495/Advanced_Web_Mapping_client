<template>
  <div id="text" class="text">
    <h4>Login</h4>

    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group id="username" label="Username*" label-for="username">
        <b-form-input name="usernameInput"
                      v-model="userInfo.username"
                      :state="validateState('username')"
                      aria-describedby="username-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="username-feedback">
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="password" label="Password*" label-for="password">
        <b-form-input type="password"
                      name="passwordInput"
                      v-model="userInfo.password"
                      :state="validateState('password')"
                      aria-describedby="password-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="password-feedback">
          This is a required field, must be at least 8 characters(contain uppercase, lowercase and special letters)
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="btn btn-dark">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import $ from 'jquery'
import { validationMixin } from "vuelidate"
import { required } from "vuelidate/lib/validators"

import '@/assets/css/index.css'

import userApi from "@/api/user"
import token from "@/store/token"
import {regex} from "vuelidate/lib/validators/common";

export var password = regex('password', /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/)


export default {
  name: "Login",
  mixins: [validationMixin],
  data() {
    return {
      userInfo:{
        username: '',
        password: ''
      }
    }
  },
  validations: {
    userInfo: {
      username: {
        required
      },
      password: {
        required,
        password
      }
    }
  },
  created() {
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height() + 10, "position": "absolute"
    })
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.userInfo[name]
      return $dirty? !$error : null
    },
    onSubmit() {
      this.$v.userInfo.$touch()

      if(this.$v.userInfo.$anyError) {
        return
      }

      this.login()
    },
    login() {
      userApi.login(this.userInfo)
          .then(response => {
            if(response.data.result === true) {
              token.set(response.data.token)
              token.setUser(response.data.user)

              this.$message({
                message: response.data.info,
                type: 'success'
              })

              this.$router.push("/map")
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
