<template>
  <div id="text" class="text">
    Welcome to Yushun AWM 2022/23!
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
