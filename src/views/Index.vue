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
  },
  methods: {
  }
}
</script>

<style scoped/>
