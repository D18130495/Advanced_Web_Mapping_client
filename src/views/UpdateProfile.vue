<template>
  <div id="text" class="text">
    <h4>Update profile</h4>

    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group id="firstName" label="First name" label-for="firstName">
        <b-form-input name="firstNameInput"
                      v-model="userInfo.firstName">
        </b-form-input>
      </b-form-group>

      <b-form-group id="lastName" label="Last name" label-for="lastName">
        <b-form-input name="lastNameInput"
                      v-model="userInfo.lastName">
        </b-form-input>
      </b-form-group>

      <b-form-group id="email" label="Email" label-for="email">
        <b-form-input name="emailInput"
                      v-model="userInfo.email"
                      :state="validateState('email')"
                      aria-describedby="email-feedback">
        </b-form-input>

        <b-form-invalid-feedback id="email-feedback">
          Please follow the email format. (example: xxx@xxx.xx)
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="btn btn-dark">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import $ from "jquery"
import { validationMixin } from "vuelidate"
import { email } from "vuelidate/lib/validators"

import '@/assets/css/index.css'

import userApi from "@/api/user"
import token from "@/store/token"


export default {
  name: "UpdateProfile",
  mixins: [validationMixin],
  data() {
    return {
      userInfo:{
        token: '',
        firstName: '',
        lastName: '',
        email: ''
      }
    }
  },
  validations: {
    userInfo: {
      email: {
        email
      }
    }
  },
  created() {
    this.userInfo.token = token.get()
    this.getCurrentUserInfo()
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

      this.updateProfile()
    },
    getCurrentUserInfo() {
      userApi.getCurrentUserInfo(this.userInfo.token)
          .then(response => {
            if(response.data.result === true) {
              this.userInfo.firstName = response.data.firstName
              this.userInfo.lastName = response.data.lastName
              this.userInfo.email = response.data.email
            }
          }).catch(error => {
            console.log(error)
      })
    },
    updateProfile() {
      userApi.updateUserProfile(this.userInfo)
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
