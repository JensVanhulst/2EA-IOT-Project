<!-- @format -->
<!-- eslint-disable-->
<template>
  <div class="dashboard">
    <v-overlay :value="overlay" z-index="1000">
      <v-progress-circular indeterminate size="64" width="10" color="rgb(29, 51, 69)"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="succes_snackbar" color="success" :timeout="timeout" top>
      {{ succes_text }}
      <v-btn dark text @click="succes_snackbar = false">
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
    <section v-if="error === false" id="last-update" class="d-flex align-items-center flex-wrap mt-10 pb-0">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12">
            <v-alert class="py-5 mt-5" type="info"> De laatste update van data : {{ update_period }} </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Last data update end -->

    <!-- server error start -->
    <section v-if="error === true" id="server-error" class="d-flex align-items-center flex-wrap  pb-0">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12">
            <v-alert class="py-5 mt-5" type="error"> {{ error_message }}</v-alert>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- server error end -->

    <!-- Database operations start -->
    <section v-if="isLoggedIn" id="operations" class=" pb-0 d-flex align-items-center flex-wrap pt-0">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12">
            <h3 class="heading my-2">Operations</h3>
            <p class="subheading font-italic font-weight-medium">Bewerk de data in de database met de volgende knoppen.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" class="ml-0 mr-5">
            <div>
              <v-btn color="success" x-large dark @click="$router.push('/iot/add')">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </v-btn>
            </div>
          </v-col>
          <v-col cols="1" class="mx-5">
            <div>
              <v-btn color="warning" x-large dark @click="$router.push('/iot/edit')">
                <font-awesome-icon :icon="['fas', 'pencil-alt']" />
              </v-btn>
            </div>
          </v-col>
          <v-col cols="1" class="mx-5">
            <div>
              <v-btn color="error" x-large dark @click="$router.push('/iot/delete')">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Database operations end -->

    <!-- Sensor overzicht start -->
    <div id="sensor-table" class="block d-flex align-items-center flex-wrap">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12">
            <h3 class="heading my-2">Een overzicht van de data</h3>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col md12 class="text-center">
            <v-card class="elevation-5">
              <v-card-title>
                Sensor overzicht
                <v-spacer></v-spacer>
                <v-text-field v-model="sensor_search" append-icon="mdn-search" rounded label="Zoeken" outlined hide-details></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="sensor_headers"
                :items="response_sensor"
                :search="sensor_search"
                :items-per-page="5"
                :loading="sensor_loading"
                loading-text="Loading... Please wait"
              >
                <template v-slot:item.action="{ item }">
                  <v-icon regular @click="deleteSensor(item)">
                    mdi-delete-outline
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Sensor overzicht end -->

    <!-- Data overzicht start -->
    <div id="data-table" class=" block d-flex align-items-center flex-wrap">
      <v-container fluid>
        <v-row>
          <v-col md12 class="text-center">
            <v-card class="elevation-5">
              <v-card-title>
                Data overzicht
                <v-spacer></v-spacer>
                <v-text-field v-model="data_search" append-icon="mdn-search" rounded label="Zoeken" outlined hide-details></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="data_headers"
                :items="response_data"
                :search="data_search"
                :items-per-page="15"
                :loading="data_loading"
                loading-text="Loading... Please wait"
              >
                <template v-if="isLoggedIn" v-slot:item.action="{ item }">
                  <v-icon regular @click="deleteValue(item)">
                    mdi-delete-outline
                  </v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Data overzicht end -->
  </div>
</template>

<script>
import { fb } from "../../firebase";
import axios from "axios";

const baseURL = "http://www.jensvanhulst.tech:3000";

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 * @vue-data {Number} [timeout_5000=5000] - Sets the alert message to a timeout value (ms)
 *
 * @vue-data {Boolean} [error=false] - Sets the error flag to true if there is an error
 * @vue-data {String} [error_message=empty] - Displays the error message in an alert when there is one
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text=Data succesvol gedelete]- Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps..."] - Sets the failure message
 *
 * @vue-data {String} [update_period=null] - Displays the latest date when the data was updated
 *
 * @vue-data {Array<JSON>} [response_data=empty] - Receives the data from the axios request
 * @vue-data {Array<JSON>} [response_sensor=empty] - Receives the sensors from the axios request
 *
 * @vue-data {Boolean} [isLoggedIn=false] - Sets a flag if user is logged in so we can show sections based on if someone is logged in or not
 * @vue-data {Boolean} [currentUser=false] - Sets the currentUser to the Firebase user object
 *
 * @vue-data {String} [sensor_search=empty] - Filters the sensors table depending on the input value
 * @vue-data {String} [data_search=empty] - Filters the data table depending on the input value
 *
 * @vue-data {Boolean} [sensor_loading=false] - Displays the table's loading animation when table is loading the data
 * @vue-data {Boolean} [data_loading=false] - Displays the table's loading animation when table is loading the data
 *
 * @vue-data {Array<Object>} [sensor_headers] - Configuration for the sensor overview table headers
 * @vue-data {Array<Object>} [data_headers] - Configuration for the data overview table headers
 */

export default {
  /* eslint-disable */
  name: "dashboard",
  data() {
    return {
      //loading overlay
      overlay: false,
      timeout: 5000,

      error: false,
      error_message: "",

      //snackbar config
      succes_snackbar: false,
      succes_text: "Data succesvol gedelete",

      //snackbar config
      failure_snackbar: false,
      failure_text: "Oeps er is iets misgelopen probeer later opnieuw",

      //variable to store the latest date of the data is updated
      update_period: null,
      response_data: [],
      response_sensor: [],

      //auth variables
      isLoggedIn: false,
      currentUser: false,

      // search variables for the search functionality in the tables
      sensor_search: "",
      data_search: "",

      //Booleans to toggle loading animation on the tables
      sensor_loading: false,
      data_loading: false,

      //Latest Values
      latestTemp: null,
      latestLight: null,

      prevTimestamp: null,

      // table formatation and data
      sensor_headers: [
        {
          text: "Indentificatienummer (ID)",
          align: "left",
          sortable: false,
          value: "ID"
        },
        { text: "Brand", value: "Brand", align: "center" },
        { text: "IP adres", value: "IP", align: "center" },
        { text: "Sensorwaarde", value: "Value", align: "center" },
        { text: "Timestamp", value: "Timestamp", align: "center" },
        { text: "Bewerking", value: "action", sortable: false, align: "center" }
      ],

      data_headers: [
        {
          text: "Indentificatienummer (ID)",
          align: "left",
          sortable: false,
          value: "ID"
        },
        { text: "Sensorwaarde", value: "Value", align: "center" },
        { text: "Timestamp", value: "Timestamp", align: "center" },
        { text: "Bewerking", value: "action", sortable: false, align: "center" }
      ]
    };
  },

  created() {
    //check if user is logged in
    if (fb.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = fb.auth().currentUser.email;
    }
  },

  mounted() {
    this.overlay = true;
    this.getLatestValues();
    this.fetchData();
    this.fetchSensors();
    this.getDate();
    this.overlay = false;
  },

  methods: {
    /**
     * Gets The latest value from the API
     */
    getLatestLightValue() {
      return axios.get(baseURL + "/get", {
        params: {
          id: "lkv",
          sensor: "SENSOR_002_LIGHT"
        }
      });
    },

    /**
     * Gets The latest value from the API
     */
    getLatestTempValue() {
      return axios.get(baseURL + "/get", {
        params: {
          id: "lkv",
          sensor: "SENSOR_001_TEMP"
        }
      });
    },

    getLatestValues() {
      axios
        .all([this.getLatestTempValue(), this.getLatestLightValue()])
        .then(
          axios.spread((acct, perms) => {
            this.latestTemp = acct.data;
            this.latestLight = perms.data;
            if ((this.latestTemp !== null && this.latestLight !== null) || this.latestTemp[0].Value !== "undefined") {
              this.updateLatestValues();
            }
          })
        )
        .catch((error) => {});
    },

    updateLatestValues() {
      axios
        .all([this.updateLatestTempValue(), this.updateLatestLightValue()])
        .then(axios.spread((acct, perms) => {}))
        .catch((error) => {});
    },

    /**
     * Updates The latest value from the API
     */
    updateLatestTempValue() {
      return axios.put(baseURL + "/update", null, {
        params: {
          type: "lkv",
          id: "SENSOR_001_TEMP",
          val: this.latestTemp[0].Value,
          time: this.latestTemp[0].Timestamp
        }
      });
    },

    /**
     * Updates The latest value from the API
     */
    updateLatestLightValue() {
      return axios.put(baseURL + "/update", null, {
        params: {
          type: "lkv",
          id: "SENSOR_002_LIGHT",
          val: this.latestLight[0].Value,
          time: this.latestLight[0].Timestamp
        }
      });
    },

    /**
     * Gets all sensor data from the API
     */
    fetchData() {
      this.data_loading = true;
      axios
        .get(baseURL + "/get", {
          params: {
            table: "SensorData"
          }
        })
        .then((response) => {
          this.response_data = response.data;
        })
        .catch((error) => {
          this.error = true;
          this.error_message = error;
        })
        .finally(() => {
          this.data_loading = false;
        });
    },

    /**
     * Gets all sensors from the API
     */
    fetchSensors() {
      this.sensor_loading = true;
      axios
        .get(baseURL + "/get", {
          params: {
            table: "SensorOverview"
          }
        })
        .then((response) => {
          this.response_sensor = response.data;
        })
        .catch((error) => {
          this.error = true;
          this.error_message = error;
        })
        .finally(() => {
          this.sensor_loading = false;
        });
    },

    /**
     * Gets a new date for the update_period
     */
    getDate() {
      var date = new Date();
      var new_date = this.formatDate(date);
      this.update_period = new_date;
    },

    /**
     * Formates the newly created date into YYYY/MM/DD HH:MM:SS
     * @param {Date} date - Accepts a date object
     * @returns {String} - Formatted date
     */
    formatDate(date) {
      return (
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2)
      );
    },

    /**
     * Deletes a sensor from within the table (operations)
     * @param {Object} item - Gets in an object that contains the data from the clicked item in table
     * @returns {void} - Void
     */
    deleteSensor(item) {
      this.overlay = true;
      axios
        .delete(baseURL + "/delete", {
          params: {
            type: "sensor",
            id: item.ID
          }
        })
        .then((response) => {
          this.overlay = false;
          if (response.status === 200) {
            this.succes_snackbar = true;
          } else if (response.status === 500) {
            this.failure_snackbar = true;
          }
        })
        .catch((error) => {
          this.failure_snackbar = true;
        })
        .finally(() => {
          window.location.reload();
        });
    },

    /**
     * Deletes a value from within the table (operations)
     * @param {Object} item - Gets in an object that contains the data from the clicked item in table
     * @returns {void} - Void
     */
    deleteValue(item) {
      this.overlay = true;
      axios
        .delete(baseURL + "/delete", {
          params: {
            type: "data",
            id: item.ID,
            val: item.Value,
            time: item.Timestamp
          }
        })
        .then((response) => {
          this.overlay = false;
          if (response.status === 200) {
            this.succes_snackbar = true;
          } else if (response.status === 500) {
            this.failure_snackbar = true;
          }
        })
        .catch((error) => {
          this.failure_snackbar = true;
        })
        .finally(() => {
          window.location.reload();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  padding: 0 100px;
}
</style>
