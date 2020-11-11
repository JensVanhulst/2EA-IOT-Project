<template>
  <div class="seperate-data">
    <!-- server error start -->
    <v-container v-if="error === true">
      <v-row>
        <v-col cols="12" md="12">
          <v-alert class="py-5 mt-5" type="error"> {{ error_message }}</v-alert>
        </v-col>
      </v-row>
    </v-container>
    <!-- server error end -->
    <v-container>
      <v-row>
        <v-col md12 class="text-center">
          <v-card class="elevation-5">
            <v-card-title>
              Temperature data
              <v-spacer />
              <v-text-field
                v-model="temp_search"
                label="Search"
                outlined
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="temp_header"
              :items="response_temp_data"
              :search="temp_search"
              :items-per-page="15"
              :loading="temp_loading"
              loading-text="Loading... Please wait"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col md12 class="text-center">
          <v-card class="elevation-5">
            <v-card-title>
              Light Data
              <v-spacer />
              <v-text-field
                v-model="light_search"
                label="Search"
                outlined
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="light_header"
              :items="response_light_data"
              :search="light_search"
              :items-per-page="15"
              :loading="light_loading"
              loading-text="Loading... Please wait"
            ></v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';

/**
 * @vue-data {Array<JSON>} [response_temp_data=empty] - Receives the values from the request
 * @vue-data {Array<JSON>} [response_light_data=empty] - Receives the values from the request
 *
 * @vue-data {Boolean} [temp_loading=false] - Displays the table's loading animation when table is loading the data
 * @vue-data {Boolean} [light_loading=false] - Displays the table's loading animation when table is loading the data
 *
 * @vue-data {String} [temp_search=empty] - Filters the temperatures table depending on the input value
 * @vue-data {String} [light_search=empty] - Filters the light table depending on the input value
 *
 * @vue-data {Array<Object>} [temp_headers] - Configuration for the temperature table headers
 * @vue-data {Array<Object>} [light_headers] - Configuration for the light overview table headers
 */
export default {
  data() {
    return {
      response_temp_data: [],
      response_light_data: [],

      // search variables for the search functionality in the tables
      temp_search: '',
      light_search: '',

      //Booleans to toggle loading animation on the tables
      temp_loading: false,
      light_loading: false,

      error: false,
      error_message: '',

      // table formatation and data
      temp_header: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'ID',
        },
        { text: 'Value', value: 'Value', align: 'center' },
        { text: 'Timestamp', value: 'Timestamp', align: 'center' },
      ],

      light_header: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'ID',
        },
        { text: 'Value', value: 'Value', align: 'center' },
        { text: 'Timestamp', value: 'Timestamp', align: 'center' },
      ],
    };
  },

  mounted() {
    this.fetchTempData();
    this.fetchLightData();
  },

  methods: {
    /**
     * Fetches the temperature data from the API
     */
    fetchTempData() {
      this.temp_loading = true;
      axios
        .get(this.$API_URL + '/get', {
          params: {
            table: 'SensorData',
            id: 'SENSOR_001_TEMP',
          },
        })
        .then((response) => {
          this.response_temp_data = response.data;
        })
        .catch((error) => {
          this.error = true;
          this.error_message = error;
        })
        .finally(() => {
          this.temp_loading = false;
        });
    },

    /**
     * Fetches the light data from the API
     */
    fetchLightData() {
      this.light_loading = true;
      axios
        .get(this.$API_URL + '/get', {
          params: {
            table: 'SensorOverview',
            id: 'SENSOR_002_LIGHT',
          },
        })
        .then((response) => {
          this.response_light_data = response.data;
        })
        .catch((error) => {
          this.error = true;
          this.error_message = error;
        })
        .finally(() => {
          this.light_loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  padding: 0px 100px;
}
</style>
