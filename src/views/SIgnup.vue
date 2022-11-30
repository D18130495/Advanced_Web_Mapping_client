<template>
  <div id="text" class="text">
    <h4>Sign up</h4>

    <button type="submit" class="btn btn-dark">Log In</button>
  </div>
</template>

<script>
import '@/assets/css/index.css'
import $ from "jquery";

export default {
  name: "Signup",
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
