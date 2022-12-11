<template>
  <div id="text" class="text">
    Welcome to Irish Rail Realtime Station Information!<br><br>
    You can find the Irish rail station information and nearby services(pub, restaurant, etc.)!
  </div>
</template>

<script>
import '@/assets/css/index.css'
import $ from "jquery";

export default {
  name: "Home",
  data() {
    return {
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
  }
}
</script>

<style scoped/>
