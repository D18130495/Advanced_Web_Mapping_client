<template>
  <div id="text" class="text">
      <div id="map"></div>
  </div>
</template>

<script>
import $ from "jquery"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

import '@/assets/css/index.css'


const options = {
  center: [53.34, -6.27],
  minZoom: 0,
  maxZoom: 18,
  zoom: 12.5,
  zoomControl: true,
  doubleClickZoom: true,
  dragging: true,
  boxZoom: true,
  scrollWheelZoom: true,
  zoomSnap: 0.5,
  fullscreenControl: true,
  // attributionControl: true,
  attribution: '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap Yushun Zeng</a>'
}

export default {
  name: "Map",
  data() {
    return {
      osmMap: {}
    }
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height() + 10, "position": "absolute"
    });

    $("#map").css({
      "width": "100%",
      "height": $(document).height() - ($("#header").height() + $("#footer").height() + 45)
    });

    this.osmMap = L.map('map', options)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options).addTo(this.osmMap)
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped/>
