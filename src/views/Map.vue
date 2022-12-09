<template>
  <div id="text" class="text">
    <div class="home row no-gutters">
<!--      <div class="col-sm-3">-->
<!--        <div v-if="cityName.length" class="toolbox">-->
<!--          <div class="sticky-top bg-white shadow-sm p-2">-->
<!--            <div class="form-group d-flex">-->
<!--              <label for="cityName" class="mr-2 col-form-label text-right">City</label>-->
<!--              <div class="flex-fill">-->
<!--                <select id="cityName" class="form-control"-->
<!--                v-model="select.city" @change="select.area = ''">-->
<!--                  <option value="">&#45;&#45; Select One &#45;&#45;</option>-->
<!--                  <option :value="c.CityName" v-for="c in cityName" :key="c.CityName">-->
<!--                    {{ c.CityName }}-->
<!--                  </option>-->
<!--                </select>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="form-group d-flex">-->
<!--              <label for="area" class="mr-2 col-form-label text-right">Position</label>-->
<!--              <div class="flex-fill">-->
<!--                <select id="area" class="form-control" v-if="select.city.length"-->
<!--                  v-model="select.area" @change="updateSelect">-->
<!--                  <option value="">&#45;&#45; Select One &#45;&#45;</option>-->
<!--                  <option :value="a.AreaName"-->
<!--                    v-for="a in cityName.find((city) => city.CityName === select.city).AreaList"-->
<!--                    :key="a.AreaName">-->
<!--                    {{ a.AreaName }}-->
<!--                  </option>-->
<!--                </select>-->
<!--              </div>-->
<!--            </div>-->
<!--            <p class="mb-0 small text-muted text-right">請先選擇區域查看（綠色表示還有口罩）</p>-->
<!--          </div>-->

<!--          <ul class="list-group">-->
<!--            <template v-for="(item, key) in data">-->
<!--              <a class="list-group-item text-left" :key="key"-->
<!--                v-if="item.properties.county === select.city-->
<!--                  && item.properties.town === select.area"-->
<!--                :class="{ 'highlight': item.properties.mask_adult || item.properties.mask_child}"-->
<!--                @click="penTo(item)">-->
<!--                <h3>{{ item.properties.name }}</h3>-->
<!--                <p class="mb-0">-->
<!--                  成人口罩：{{ item.properties.mask_adult}} | 兒童口罩：{{ item.properties.mask_child}}-->
<!--                </p>-->
<!--                <p class="mb-0">地址：<a :href="`https://www.google.com.tw/maps/place/${item.properties.address}`"-->
<!--                  target="_blank" title="Google Map">-->
<!--                  {{ item.properties.address }}</a>-->
<!--                </p>-->
<!--              </a>-->
<!--            </template>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </div>-->
      <div class="col-sm-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

import cityName from '@/assets/cityName.json'

import '@/assets/css/index.css'
import axios from "axios";

// const publicTransport = require('public-transport-ireland')

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
      cityName,
      osmMap: {},
      select: {
        city: '臺北市',
        area: '大安區',
      },
    }
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height(), "position": "absolute"
    })

    $("#toolbox").css({
      "width": "100%",
      "height": $(document).height() - ($("#header").height() + $("#footer").height() + 45)
    });

    $("#map").css({
      "width": "100%",
      "height": $(document).height() - ($("#header").height() + $("#footer").height() + 40)
    });

    this.osmMap = L.map('map', options)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options).addTo(this.osmMap)
  },
  created() {
    // console.log(publicTransport.dublinBus.getStops)
    axios({
      url: "http://rtpi.dublinbus.ie/DublinBusRTPIService.asmx?WSDL",
      method: "get",
      crossdomain: true,
      // params: {
      //   StationCode: 'mhide',
      //   NumMins: 20
      // }
    }).then(res => {
      console.log(res.data)
    })
  },
  methods: {
  }
}
</script>

<style scoped/>
