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

    <v-snackbar v-model="alert_snackbar" color="warning" :timeout="timeout" top>
      {{ alert_text }}
      <v-btn dark text @click="alert_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

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
      <v-container>
        <v-row class="justify-center">
          <v-col cols="6" class="justify-center text-center">
            <v-date-picker
              v-model="daterange"
              range
              :landscape="true"
              min="2019-12-16"
              max="2020-01-06"
              locale="nl-BE"
              :first-day-of-week="1"
            />
            <v-btn @click="drawChart()" class="rounded primary ma-10">
              Draw chart
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="row">
          <v-col cols="12">
            <canvas id="period-chart" height="300" width="0"></canvas>
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
import axios from "axios";
var Chart = require("chart.js");
const baseURL = "http://www.jensvanhulst.tech:3000";
var chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(231,233,237)"
};

export default {
  data() {
    return {
      daterange: [],
      //loading overlay
      overlay: false,

      chart: null,
      alert_snackbar: false,
      alert_text: "Selecteer minstens 1 datum",
      failure_text: "Oeps er ging iets mis",
      failure_snackbar: false,
      timeout: 5000,

      //Filtered Timestamps
      filteredTempArray: Array,
      filteredLightArray: Array,

      temp: [],
      light: [],

      tempDates: [],
      lightDates: Array
    };
  },
  methods: {
    drawChart() {
      if (this.daterange.length != 0) {
        this.overlay = true;
        axios
          .get(baseURL + "/get", {
            params: {
              id: "custom",
              bdate: this.daterange[0],
              edate: this.daterange[1]
            }
          })
          .then(response => {
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
            this.tempDates = this.filteredTempArray.map(i => {
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
            this.lightDates = this.filteredLightArray.map(i => {
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
            this.temp = this.filteredTempArray.map(i => {
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
            this.light = this.filteredLightArray.map(i => {
              return i.Value;
            });

            //Draw the chart
            var ctx = document.getElementById("period-chart");
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
                  text: "Grafiek van sensor data over een custom tijdsinterval"
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
          })
          .catch(error => {
            if (error) {
              this.failure_snackbar = true;
            }
          })
          .finally(() => {
            this.overlay = false;
          });
      } else {
        this.alert_snackbar = true;
      }
    }
  }
};
</script>

<style lang="scss"></style>
