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

            <div class="input-group">
              <input type="search" class="form-control rounded" v-model="overpass.query"
                     placeholder="Search nearby" aria-label="Search" aria-describedby="search-addon" />&nbsp;
              <button type="button" class="btn btn-outline-primary" @click="queryOverpass">search</button>
            </div>

            <a class="mb-0 small text-muted text-right" @click="updateMap">Find yourself</a>
          </div>

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
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"

import '@/assets/css/index.css'
import 'leaflet-search/src/leaflet-search.css'

import mapApi from "@/api/map"
import axios from "axios"

let locationMarker
let circle
let osmMap = {} // main map
let osmMapMarker = {} // overpass query result display layer

// main map options
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

// icon config
const iconsConfig = {
  iconSize: [25, 40],
  iconAnchor: [12, 38],
  popupAnchor: [0, -20],
  shadowSize: [20, 20]
}

// icon (green and grey)
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

// method handle map
const method = {
  // get current position and call the setMapToCurrentLocation and update_db functions
  updateLocation() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        method.setMapToCurrentLocation(position)
        method.update_db(position)
      }
    )
  },
  // set the current location on the map
  setMapToCurrentLocation(position) {
    let myLatLon = L.latLng(position.coords.latitude, position.coords.longitude)
    osmMap.flyTo(myLatLon, 17)

    // remove marker if some marker on it
    if(locationMarker) {
      osmMap.removeLayer(locationMarker)
    }

    // set to current location
    locationMarker = L.marker(myLatLon, {
      icon: icons.grey,
    }).addTo(osmMap).addTo(osmMap).bindPopup(`<strong>Current Location</strong><br>
    Latitude:<strong>${myLatLon.lat}</strong><br>
    Longitude:<strong>${myLatLon.lng}</strong>`).openPopup();

    // remove circle if some circle there
    if(circle) {
      osmMap.removeLayer(circle)
    }

    // draw the circle around the marker
    circle = L.circle(myLatLon, {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3
    }).addTo(osmMap)
  },
  // update current location on the database
  update_db(position) {
    // form the current location
    let location = position.coords.longitude + ", " + position.coords.latitude

    // send the data to back-end
    mapApi.updateLocation({"location": location})
        .then(response => {
          console.log(response.data.info)
        }).catch(error => {
          console.log(error.response.data.info)
    })
  },
  // add marker on the map to show the station location
  addMapMarker(x, y, name) {
    osmMap.flyTo(L.latLng(x, y), 17)

    // add marker on the map
    L.marker([x, y], {
      icon: icons.green,
    }).addTo(osmMap).bindPopup(`<strong>${name}</strong><br>
    Latitude:<strong>${x}</strong><br>
    Longitude:<strong>${y}</strong>`).openPopup();

    // draw the circle around marker
    circle = L.circle(L.latLng(x, y), {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.3
    }).addTo(osmMap)
  },
  // remove all the marker and circle
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
      stationResult: '', // station result from Irish rail API
      stationArray: [], // parse the station result and store using station
      station: { // use for station array store
        stationName: '',
        stationCode: []
      },
      select: { // selected station information
        stationName: 'default',
        stationCode: '',
        stationLatitude: '',
        stationLongitude: ''
      },
      stationDetail: '', // station detail from Irish rail API
      stationDetailArray: [], // parse the station detail
      overpass: { // use for overpass result
        query: '',
        bbox: ''
      }
    }
  },
  mounted() {
    $("#text").css({
      "top": $("#header").height(), "position": "absolute"
    })

    $("#map").css({
      "width": "100%",
      "height": $(document).height() - ($("#header").height() + $("#footer").height() + 32)
    });

    // set map
    osmMap = L.map('map', options)

    // main map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options).addTo(osmMap)

    // left top search function
    L.control.search({
      url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat','lon'],
      zoom: 17,
      marker: {
        icon: icons.green
      },
      autoCollapse: true,
      autoType: false,
      minLength: 2
    }).addTo(osmMap)
  },
  created() {
    method.updateLocation(osmMap) // initial yourself location when open the map page
    this.getStationInfo() // get all the station information
  },
  methods: {
    // find yourself button clicked reset all the parameter
    updateMap() {
      method.updateLocation(osmMap)
      method.removeMapMarker()
      this.stationDetail = ''
      this.stationDetailArray = []
      this.select.stationName = 'default'
      this.select.stationCode = ''

      if(osmMapMarker) {
        osmMap.removeLayer(osmMapMarker)
      }
    },
    // get station information through Irish rail API
    getStationInfo() {
      axios({
        url: "/xml/getAllStationsXML",
        method: "get",
      }).then(response => {
        // parse xml result
        this.stationResult = this.$x2js.xml2js(response.data).ArrayOfObjStation.objStation

        // find same station name with more than one station code, and store result in stationArray
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

        // sort the result by station name
        this.stationArray.sort(function(a, b) {
          const x = a['stationName']
          const y = b['stationName']
          return x.localeCompare(y)
        })
      })
    },
    // get station detail information in 60 min, use station code
    getStationDetail() {
      axios({
        url: "/xml/getStationDataByCodeXML_WithNumMins",
        method: "get",
        crossdomain: true,
        changeOrigin: true,
        ws: true,
        params: {
          StationCode: this.select.stationCode,
          NumMins: 60
        }
      }).then(response => {
        this.stationDetail = this.$x2js.xml2js(response.data).ArrayOfObjStationData.objStationData
      })
    },
    // set the station marker
    setMarker() {
      // remove overpass result
      if(osmMapMarker) {
        osmMap.removeLayer(osmMapMarker)
      }

      // store station detail in station detail array
      if(this.stationDetail) {
        this.stationDetail.forEach((detial) => {
          this.stationDetailArray.push(detial)
        })
      }else {
        console.log("No data for this station")
      }

      // call addMapMarker to set marker on the map
      method.addMapMarker(
        this.select.stationLatitude,
        this.select.stationLongitude,
        this.select.stationName
      )
    },
    // call removeMarker
    removeMarker() {
      method.removeMapMarker()
    },
    // get current station latitude abd longitude
    getCurrentStationLatLong() {
      this.stationResult.forEach((station) => {
        if(station.StationDesc === this.select.stationName && station.StationCode === this.select.stationCode) {
          this.select.stationLatitude = station.StationLatitude
          this.select.stationLongitude = station.StationLongitude
        }
      })
    },
    // when the station name and station code selected
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
    },
    // query overpass
    queryOverpass() {
      // set bbox area
      this.overpass.bbox = osmMap.getBounds().toBBoxString()

      if(osmMapMarker) {
        osmMap.removeLayer(osmMapMarker)
      }

      // if user input something
      if(this.overpass.query !== '') {
        mapApi.queryOverpass(this.overpass)
            .then(response => {
              // create new map layer with cluster
              osmMapMarker = L.markerClusterGroup()

              // set up new layer with overpass result
              let geoJsonLayer = L.geoJson(response.data, {
                pointToLayer: function (feature, latlng) {
                  return L.marker(latlng, {
                    icon: icons.green
                  });
                },
                onEachFeature: function (feature, layer) {
                  layer.bindPopup(`<strong>${feature.properties.name}</strong><br>
                                  Opening:<strong>${feature.properties.opening_hours}</strong><br>
                                  Email:<strong>${feature.properties.email}</strong><br>
                                  Phone:<strong>${feature.properties.phone}</strong><br>
                                  Website:<strong>${feature.properties.website}</strong>`)
                }
              })

              // set information on the overpass layer
              osmMapMarker.addLayer(geoJsonLayer)

              // add overpass layer to the main map
              osmMap.addLayer(osmMapMarker)
            })
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
