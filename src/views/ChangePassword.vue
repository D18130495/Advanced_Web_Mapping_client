<template>
  <div id="text" class="text">
    <h4>Change password</h4>

    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group id="oldPassword" label="Old password*" label-for="oldPassword">
        <b-form-input type="password"
                      name="oldPasswordInput"
                      v-model="userInfo.oldPassword"
                      :state="validateState('oldPassword')"
                      aria-describedby="oldPassword-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="oldPassword-feedback">
          This is a required field.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="newPassword" label="New password*" label-for="newPassword">
        <b-form-input type="password"
                      name="newPasswordInput"
                      v-model="userInfo.newPassword"
                      :state="validateState('newPassword')"
                      aria-describedby="newPassword-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="newPassword-feedback">
          This is a required field, must be at least 8 characters(contain uppercase, lowercase and special letters) and can not equal to old password.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="confirm" label="Password confirmation*" label-for="confirm">
        <b-form-input type="password"
                      name="confirmInput"
                      v-model="userInfo.confirmPassword"
                      :state="validateState('confirmPassword')"
                      aria-describedby="confirm-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="confirm-feedback">
          Your confirmed password is not equal to the password.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="btn btn-dark">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import $ from "jquery"
import { validationMixin } from "vuelidate"
import { required, sameAs, not } from "vuelidate/lib/validators"
import { regex } from "vuelidate/lib/validators/common"

import '@/assets/css/index.css'
import userApi from "@/api/user";
import token from "@/store/token";

export var password = regex('password', /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/)


export default {
  name: "ChangePassword",
  mixins: [validationMixin],
  data() {
    return {
      userInfo:{
        token: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  validations: {
    userInfo: {
      oldPassword: {
        required
      },
      newPassword: {
        required,
        password,
        isValid: not(sameAs('oldPassword'))
      },
      confirmPassword: {
        required,
        sameAs: sameAs('newPassword')
      }
    }
  },
  created() {
    this.userInfo.token = token.get()
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

      this.changePassword()
    },
    changePassword() {
      userApi.changeUserPassword(this.userInfo)
          .then(response => {
            if(response.data.result === true) {
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
