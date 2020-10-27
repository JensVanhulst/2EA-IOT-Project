<!-- @format -->
<!-- eslint-disable   -->
<template>
  <div class="add">
    <v-overlay :value="overlay" z-index="1000">
      <v-progress-circular indeterminate size="64" width="10" color="rgb(29, 51, 69)"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="succes_snackbar" color="success" :timeout="timeout_5000" top>
      {{ succes_text }}
      <v-btn dark text @click="succes_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="failure_snackbar" color="error" :timeout="timeout_5000" top>
      {{ failure_text }}
      <v-btn dark text @click="failure_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <section id="add">
      <v-container fluid>
        <v-row class="pt-10">
          <v-col cols="12">
            <h2 class="text-center">Voeg data toe aan de database :</h2>
          </v-col>
        </v-row>
        <v-row justify="center">
          <div class="form-container">
            <v-form ref="add_data_form">
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="7">
                    <!-- Select Type -->
                    <v-select v-model="option_1" :items="add_tabletypes" label="Wat wilt u toevoegen ?" outlined></v-select>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'data'">
                    <!-- Select sensor -->
                    <v-select v-model="option_2" :items="add_sensor" label="Selecteer een sensor" outlined></v-select>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'sensor'">
                    <!-- ID -->
                    <v-text-field v-model="option_3" :rules="[rules.required]" label="Vul een id in" outlined></v-text-field>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'sensor'">
                    <!-- Brand -->
                    <v-text-field v-model="option_4" :rules="[rules.required]" label="Vul een merk in" outlined></v-text-field>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'sensor'">
                    <!-- ip -->
                    <v-text-field v-model="option_5" :rules="[rules.required]" label="Vul een ip address in" outlined></v-text-field>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'data' || option_1 === 'sensor'">
                    <!-- Value -->
                    <v-text-field v-model="option_6" :rules="[rules.required]" type="number" label="Vul de gemeten waarde in" outlined></v-text-field>
                  </v-col>
                  <v-col cols="7" v-show="option_1 === 'data' || option_1 === 'sensor'">
                    <!-- Timestamp -->
                    <v-text-field v-model="option_7" :rules="[rules.required]" label="Vul de timestamp in " outlined></v-text-field>
                    <v-checkbox
                      @change="getCurrentTimestamp"
                      v-model="current_timestamp"
                      label="Vul de huidige timestamp in"
                      class="pa-0 ma-0"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="7" align="center">
                    <v-btn v-on:click="addNewData()" class="success" dark rounded outlined>Voeg data toe</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </div>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import axios from "axios";

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {Boolean} [current_timestamp=false] - Option to take the current time as timestamp
 *
 * @vue-data {String} [option_1=null] - Asks user what they want to insert (sensor or data)
 * @vue-data {String} [option_2=null] - Asks user to input an ID for the new sensor
 * @vue-data {String} [option_3=null] - Asks user to select a sensor
 * @vue-data {String} [option_4=null] - Asks user to input a brand for the new sensor
 * @vue-data {String} [option_5=null] - Asks user to input an IP address for the new sensor
 * @vue-data {Number} [option_6=null] - Asks user to input a value for the new sensor
 * @vue-data {Timestamp} [option_7=null] - Asks user to input a timestamp for the new sensor
 *
 * @vue-data {String} [succes_text="Data succesvol toegevoegd"] - Sets the succes message
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {Array<String>} [add_tabletypes] - Gives the user the options to what type of data they can add
 * @vue-data {Array<String>} [add_sensor] - Gives the user the options which id of sensor they want
 * @vue-data {Object} [rules] - Applies validation to the form
 *
 * @vue-data {Number} [timeout_5000=5000] - Sets the alert message to a timeout value (ms)
 *
 */
const baseURL = "http://www.jensvanhulst.tech:3000";

export default {
  /* eslint-disable */
  data() {
    return {
      //loading overlay
      overlay: false,
      timeout_5000: 5000,

      //snackbar config
      succes_snackbar: false,
      succes_text: "Data succesvol toegevoegd",

      //snackbar config
      failure_snackbar: false,
      failure_text: "Oeps er is iets misgelopen probeer later opnieuw",

      //properties for the form
      add_tabletypes: ["sensor", "data"],
      add_sensor: ["SENSOR_001_TEMP", "SENSOR_002_LIGHT"],

      //form option
      option_1: null,
      option_2: null,
      option_3: null,
      option_4: null,
      option_5: null,
      option_6: null,
      option_7: null,

      //Checkbox to get current timestamp
      current_timestamp: false,

      //validate form
      rules: {
        required: (value) => !!value || "Dit veld is vereist."
      }
    };
  },
  methods: {
    /**
     * Creates the newly entered data
     */
    addNewData() {
      this.overlay = true;
      axios
        .post(baseURL + "/add", null, {
          params: {
            type: this.option_1,
            id: this.option_2,
            nid: this.option_3,
            brand: this.option_4,
            ip: this.option_5,
            val: this.option_6,
            time: this.option_7
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
          this.overlay = false;
          this.failure_snackbar = true;
        })
        .finally(() => {
          this.$refs.add_data_form.reset();
          this.$refs.add_data_form.resetValidation();
        });
    },

    /**
     * Gets the current timestamp
     * @see Copied from : https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
     */
    getCurrentTimestamp() {
      if (this.current_timestamp == true) {
        var date = new Date();
        date =
          date.getFullYear() +
          "-" +
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("00" + (date.getDate())).slice(-2) +
          " " +
          ("00" + (date.getHours() -5)).slice(-2) +
          ":" +
          ("00" + date.getMinutes()).slice(-2) +
          ":" +
          ("00" + date.getSeconds()).slice(-2);
        this.option_7 = date;
      } else {
        this.option_7 = "";
      }
    }
  }
};
</script>

<style></style>
