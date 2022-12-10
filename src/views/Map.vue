<template>
  <div id="text" class="text">
    <div class="home row no-gutters">
      <div class="col-sm-3">
        <div v-if="stationArray.length" class="toolbox">
          <div class="sticky-top bg-white shadow-sm p-2">
            <div class="form-group d-flex">
              <label for="stationName" class="mr-2 col-form-label text-right">Station</label>
              <div class="flex-fill">
                <select id="stationName" class="form-control" v-model="select.stationName" @change="select.stationCode = ''">
                  <option value="default">-- Select One --</option>
                  <option :value="station.stationName" v-for="station in stationArray" :key="station.stationName">
                    {{ station.stationName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group d-flex" v-if="stationArray.find((item) => item.stationName === select.stationName)">
              <label for="stationCode" class="mr-2 col-form-label text-right">Station</label>
              <div class="flex-fill">
                <select id="stationCode" class="form-control" v-model="select.stationCode" @change="queryTimetable">
                  <option :value="stationCode"
                          v-for="stationCode in stationArray.find((item) => item.stationName === select.stationName).stationCode"
                          :key="stationCode">
                    {{ stationCode }}
                  </option>
                </select>
              </div>
            </div>
            <a class="mb-0 small text-muted text-right" @click="updateMap">Find yourself</a>
          </div>
<!--          @click="penTo(item)"-->
          <ul class="list-group"  v-if="stationDetailArray">
            <template v-for="(item, key) in stationDetailArray">
              <a class="list-group-item text-left" :key="key">
                <h3>Train code: {{ item.Traincode }}</h3>
                <p class="mb-1">
                  Origin: {{ item.Origin}}
                  <br>
                  Destination: {{ item.Destination}}
                </p>
                <p class="mb-1">
                  Due In: {{ item.Duein }} | Late: {{ item.Late }}
                </p>
                <p class="mb-1">
                  Exp Arrival: {{ item.Exparrival }} | Exp Departure: {{ item.Expdepart }}
                </p>
                <p class="mb-1">
                  Sch Arrival: {{ item.Scharrival }} | Sch Departure: {{ item.Schdepart }}
                </p>
              </a>
            </template>
          </ul>

          <ul class="list-group"  v-if="stationDetailArray.length === 0 && select.stationCode !== ''">
            <template>
              <div class="list-group-item text-center">
                No train available in this station
              </div>
            </template>
          </ul>
        </div>
      </div>

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

import '@/assets/css/index.css'

import mapApi from "@/api/map"
import axios from "axios";

let locationMarker
let circle
let osmMap = {}

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

const iconsConfig = {
  iconSize: [25, 40],
  iconAnchor: [12, 38],
  popupAnchor: [0, -20],
  shadowSize: [20, 20]
}

const icons = {
  green: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    ...iconsConfig
  }),
  grey: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    ...iconsConfig
  })
}

const method = {
  updateLocation() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        method.setMapToCurrentLocation(position)
        method.update_db(position)
      }
    )
  },
  setMapToCurrentLocation(position) {
    console.log("In setMapToCurrentLocation.");
    let myLatLon = L.latLng(position.coords.latitude, position.coords.longitude)
    osmMap.flyTo(myLatLon, 17)

    if(locationMarker) {
      osmMap.removeLayer(locationMarker)
    }

    locationMarker = L.marker(myLatLon, {
      icon: icons.grey,
    }).addTo(osmMap).addTo(osmMap).bindPopup(`<strong>Current Location</strong><br>
    Latitude:<strong>${myLatLon.lat}</strong><br>
    Longitude:<strong>${myLatLon.lng}</strong>`).openPopup();

    if(circle) {
      osmMap.removeLayer(circle)
    }

    circle = L.circle(myLatLon, {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3
    }).addTo(osmMap)
  },
  update_db(position) {
    let location = position.coords.longitude + ", " + position.coords.latitude

    mapApi.updateLocation({"location": location})
        .then(response => {
          console.log(response.data.info)
        }).catch(error => {
          console.log(error.data.info)
    })
  },
  addMapMarker(x, y, name) {
    osmMap.flyTo(L.latLng(x, y), 17)

    L.marker([x, y], {
      icon: icons.green,
    }).addTo(osmMap).bindPopup(`<strong>${name}</strong><br>
    Latitude:<strong>${x}</strong><br>
    Longitude:<strong>${y}</strong>`).openPopup();

    circle = L.circle(L.latLng(x, y), {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3
    }).addTo(osmMap)
  },
  removeMapMarker() {
    osmMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        osmMap.removeLayer(layer)
      }

      if (layer instanceof L.Circle) {
        osmMap.removeLayer(layer)
      }
    })
  }
}


export default {
  name: "Map",
  data() {
    return {
      stationResult: '',
      stationArray: [],
      station: {
        stationName: '',
        stationCode: []
      },
      select: {
        stationName: 'default',
        stationCode: '',
        stationLatitude: '',
        stationLongitude: ''
      },
      stationDetail: '',
      stationDetailArray: []
    }
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height(), "position": "absolute"
    })

    // $("#toolbox").css({
    //   "width": "100%",
    //   "height": $(document).height() - ($("#header").height() + $("#footer").height() + 32)
    // });

    $("#map").css({
      "width": "100%",
      "height": $(document).height() - ($("#header").height() + $("#footer").height() + 32)
    });

    osmMap = L.map('map', options)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options).addTo(osmMap)
  },
  created() {
    method.updateLocation(osmMap)
    this.getStationInfo()
  },
  methods: {
    updateMap() {
      method.updateLocation(osmMap)
      method.removeMapMarker()
      this.stationDetail = ''
      this.stationDetailArray = []
      this.select.stationName = 'default'
      this.select.stationCode = ''
    },
    getStationInfo() {
      axios({
        url: "getAllStationsXML",
        method: "get",
        crossdomain: true
      }).then(response => {
        this.stationResult = this.$x2js.xml2js(response.data).ArrayOfObjStation.objStation

        this.stationResult.forEach((station) => {
          if(this.stationArray.findIndex((item) => item.stationName === station.StationDesc) === -1) {
            this.station.stationName = station.StationDesc
            this.station.stationCode.push(station.StationCode)

            this.stationResult.forEach((item) => {
              if(item.StationDesc === station.StationDesc && item.StationCode !== station.StationCode) {
                this.station.stationCode.push(item.StationCode)
              }
            })

            this.stationArray.push(this.station)
            this.station = {}
            this.station.stationName = ''
            this.station.stationCode = []
          }
        })

        this.stationArray.sort(function(a, b) {
          const x = a['stationName']
          const y = b['stationName']
          return x.localeCompare(y)
        })
      })
    },
    getStationDetail() {
      axios({
        url: "getStationDataByCodeXML_WithNumMins",
        method: "get",
        crossdomain: true,
        params: {
          StationCode: this.select.stationCode,
          NumMins: 60
        }
      }).then(response => {
        this.stationDetail = this.$x2js.xml2js(response.data).ArrayOfObjStationData.objStationData
      })
    },
    setMarker() {
      if(this.stationDetail) {
        this.stationDetail.forEach((detial) => {
          this.stationDetailArray.push(detial)
        })
      }else {
        console.log("no")
      }

      method.addMapMarker(
        this.select.stationLatitude,
        this.select.stationLongitude,
        this.select.stationName
      )
    },
    removeMarker() {
      method.removeMapMarker()
    },
    getCurrentStationLatLong() {
      this.stationResult.forEach((station) => {
        if(station.StationDesc === this.select.stationName && station.StationCode === this.select.stationCode) {
          this.select.stationLatitude = station.StationLatitude
          this.select.stationLongitude = station.StationLongitude
        }
      })
    },
    queryTimetable() {
      this.stationDetail = ''
      this.stationDetailArray = []

      if(this.select.stationCode !== undefined) {
        this.getStationDetail()

        setTimeout(()=>{
          this.getCurrentStationLatLong()
          this.removeMarker()
          this.setMarker()
        },1500)
      }
    }
  }
}
</script>

<style lang="scss">
.toolbox {
  height: 88.5vh;
  overflow-y: auto;

  a {
    cursor: pointer;
  }
}
</style>
