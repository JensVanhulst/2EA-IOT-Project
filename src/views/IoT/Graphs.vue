<!-- @format -->
<!-- eslint-disable-->
<template>
  <div class="graphs">
    <v-overlay :value="overlay" z-index="1000">
      <v-progress-circular
        indeterminate
        size="64"
        width="10"
        color="rgb(29, 51, 69)"
      ></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="failure_snackbar" color="error" :timeout="timeout" top>
      {{ failure_text }}
      <v-btn dark text @click="failure_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <!-- Last data update start -->
    <section
      v-show="chart != null"
      id="last-update"
      class="d-flex align-items-center flex-wrap mt-10 pb-0"
    >
      <v-container fluid>
        <v-row class="row">
          <v-col cols="12">
            <div style="width: 100%; overflow-x: auto;">
              <div :style="{ width: 40 * 30 + 'px', height: '600px' }">
                <canvas id="lineChart" height="300" width="0"></canvas>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Last data update start -->
    <section
      id="averages"
      class="d-flex align-items-center flex-wrap mt-10 pb-0"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12">
            <canvas id="barChart"></canvas>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
/* eslint-disable*/
import axios from "axios";
var Chart = require("chart.js");

/**
 * Defines the colors that can be used in the charts
 * @typedef {Object} chartColors
 * @property {String} red - rgb(255, 99, 132)
 * @property {String} orange - rgb(255, 159, 64)
 * @property {String} yellow - rgb(255, 205, 86)
 * @property {String} green - rgb(75, 192, 192)
 * @property {String} blue - rgb(54, 162, 235)
 * @property {String} purple - rgb(153, 102, 255)
 * @property {String} grey - rgb(231,233,237)
 */

var chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(231,233,237)"
};

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 * @vue-data {Boolean} [chart=null] - Checks if there is no error with the chart
 * @vue-data {Array} [temp=empty] - Receives the temperature from the API
 * @vue-data {Array} [light=empty] - Receives the light from the API
 * @vue-data {Array} [filteredTempArray=empty] - Filtered array that contains only temperature data
 * @vue-data {Array} [filteredLightArray=empty] - Filtered array that contains only light data
 * @vue-data {Array} [tempDates=empty] - Array that contains only temperature timestamps
 * @vue-data {Array} [lightDates=empty] - Array that contains only light timestamps
 * @vue-data {Number} [AverageTemp=null] - Average temperature
 * @vue-data {Number} [AverageLight=null] - Average lightintensity
 */

const baseURL = "http://www.jensvanhulst.tech:3000";

export default {
  data() {
    return {
      //loading overlay
      overlay: false,

      chart: null,
      temp: [],
      light: [],

      tempDates: [],
      lightDates: Array,

      failure_text: "Oeps er ging iets mis",
      failure_snackbar: false,
      timeout: 5000,

      //Filtered Timestamps
      filteredTempArray: Array,
      filteredLightArray: Array,

      AverageTemp: null,
      AverageLight: null
    };
  },

  mounted() {
    this.overlay = true;
    axios
      .get(baseURL + "/get", {
        params: {
          table: "SensorData"
        }
      })
      .then((response) => {
        /**
         *
         * Filters the temperature response array
         * @function filteredTempArray
         * @param {Element} el - Takes in an element
         * @returns {String} - Returns all elements with matched ID and puts them in filteredTempArray array.
         * @example  [{ID:"SENSOR_001_TEMP", Value: 10, Timestamp: "2019-12-12 00:00:00"}, {ID:"SENSOR_001_TEMP", Value: 10, Timestamp: "2019-12-12 00:00:00"}]
         */
        this.filteredTempArray = response.data.filter(function(el) {
          return el.ID === "SENSOR_001_TEMP";
        });

        /**
         *
         * Filters the light response array
         * @function filteredLightArray
         * @param {Element} el - Takes in an element
         * @returns {String} - Returns all elements with matched ID and puts them in filteredLightArray array.
         * @example  [{ID:"SENSOR_002_LIGHT", Value: 10, Timestamp: "2019-12-12 00:00:00"}, {ID:"SENSOR_002_LIGHT", Value: 10, Timestamp: "2019-12-12 00:00:00"}]
         */
        this.filteredLightArray = response.data.filter(function(el) {
          return el.ID === "SENSOR_002_LIGHT";
        });

        /**
         *
         * Gets the "Values from all the elements and map them in an array"
         * @function tempDates
         * @param {Index} i - Takes in an index
         * @returns {String} - Returns the timestamps ready to use.
         * @example ["2019-12-12 00:00:00","2019-12-12 00:00:00"]
         */
        this.tempDates = this.filteredTempArray.map((i) => {
          return i.Timestamp;
        });

        /**
         *
         * Gets the "Values from all the elements and map them in an array"
         * @function lightDates
         * @param {Index} i - Takes in an index
         * @returns {String} - Returns the timestamps ready to use.
         * @example ["2019-12-12 00:00:00","2019-12-12 00:00:00"]
         */
        this.lightDates = this.filteredLightArray.map((i) => {
          return i.Timestamp;
        });

        /**
         *
         * Gets the Values from all the elements and map them in an array"
         * @function temp
         * @param {Index} i - Takes in an index
         * @returns {String} - Returns the values ready to use.
         * @example [10,20,30,40,50]
         */
        this.temp = this.filteredTempArray.map((i) => {
          return i.Value;
        });

        /**
         *
         * Gets the Values from all the elements and map them in an array"
         * @function light
         * @param {Index} i - Takes in an index
         * @returns {String} - Returns the values ready to use.
         * @example [10,20,30,40,50]
         */
        this.light = this.filteredLightArray.map((i) => {
          return i.Value;
        });

        var ctx = document.getElementById("lineChart");
        this.chart = new Chart(ctx, {
          type: "line",
          data: {
            datasets: [
              {
                type: "line",
                label: "Temerature",
                data: this.temp,
                borderColor: chartColors.red,
                backgroundColor: chartColors.red,
                fill: false,
                xAxisID: "temp",
                yAxisID: "A"
              },
              {
                type: "line",
                label: "Licht",
                data: this.light,
                borderColor: chartColors.blue,
                backgroundColor: chartColors.blue,
                yAxisID: "B",
                xAxisID: "light",
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: "Grafiek van sensor data over een periode van 3 weken"
            },
            tooltips: {
              mode: "nearest",
              intersect: true
            },
            legend: {
              position: "top"
            },
            scales: {
              yAxes: [
                {
                  id: "A",
                  type: "linear",
                  position: "left",
                  ticks: {
                    beginAtZero: true
                  }
                },
                {
                  id: "B",
                  type: "linear",
                  position: "right",
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],

              xAxes: [
                {
                  id: "temp",
                  type: "category",
                  gridLines: {
                    drawOnChartArea: false
                  },
                  ticks: {
                    padding: 0,
                    maxRotation: 0,
                    autoSkip: false,
                    callback: function(label) {
                      return label;
                    }
                  },
                  labels: this.tempDates
                },
                {
                  id: "light",
                  type: "category",
                  gridLines: {
                    drawOnChartArea: false
                  },
                  ticks: {
                    padding: 0,
                    maxRotation: 0,
                    autoSkip: false,
                    callback: function(label) {
                      return label;
                    }
                  },
                  labels: this.lightDates
                }
              ]
            }
          }
        });

        //Get average temperature
        this.AverageTemp = this.calulateAverage(this.temp);

        //Get average light
        this.AverageLight = this.calulateAverage(this.light);

        var ctx = document.getElementById("barChart");
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Gegevens"],
            datasets: [
              {
                label: "Gemiddelde Temperatuur",
                backgroundColor: "#3e95cd",
                data: [this.AverageTemp]
              },
              {
                label: "Gemiddelde Lichtintensiteit",
                backgroundColor: "#8e5ea2",
                data: [this.AverageLight]
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      })
      .catch((error) => {
        this.failure_snackbar = true;
      })
      .finally(() => {
        this.overlay = false;
      });
  },

  methods: {
    /**
     *
     * Calculates the average of the inputted array and rounds it to 2 decimal places
     * @param {Array<Number>} arr - Takes in an index
     * @returns {Number} - Returns the average value
     *
     */
    calulateAverage(arr) {
      var total = 0;
      for (let i = 0; i < arr.length; i++) {
        total += arr[i];
      }
      //Rond getal af op 2 cijfers na de comma
      return Math.floor((total / arr.length) * 100) / 100;
    }
  }
};
</script>

<style lang="scss"></style>
