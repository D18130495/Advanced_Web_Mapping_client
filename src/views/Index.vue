<template>
  <div>
    <div>
      <Header/>
    </div>

    <div>
      <router-view/>
    </div>

    <div>
      <Footer/>
    </div>
  </div>
</template>

<script>
import '@/assets/css/index.css'

import Header from "../components/Header"
import Footer from "../components/Footer"

import userApi from "../api/user"

export default {
  name: "Index",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      userList: []
    }
  },
  created() {
    // this.getAllUser()
  },
  methods: {
    getAllUser() {
      userApi.getUserList()
        .then(response => {
          this.userList = response.data
          console.log(this.userList)
        }).catch(error => {
          console.log(error)
        })
    },
  }
}
</script>

<style scoped/>
