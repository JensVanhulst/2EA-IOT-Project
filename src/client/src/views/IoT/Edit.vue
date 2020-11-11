<template>
  <div class="add">
    <v-overlay :value="overlay" z-index="1000">
      <v-progress-circular
        indeterminate
        size="64"
        width="10"
        color="rgb(29, 51, 69)"
      />
    </v-overlay>

    <v-snackbar v-model="succes_snackbar" color="success" timeout="2000">
      {{ succes_text }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="succes_snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="failure_snackbar" color="error" timeout="5000">
      {{ failure_text }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="failure_snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <section id="add">
      <v-container fluid>
        <v-row class="pt-10">
          <v-col cols="12">
            <h2 class="text-center">Update records</h2>
          </v-col>
        </v-row>
        <v-row justify="center">
          <div class="form-container">
            <v-form ref="updateForm">
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="7">
                    <!-- Select Type -->
                    <v-select
                      v-model="option_1"
                      :items="update_types"
                      label="What do you want to change"
                      outlined
                    ></v-select>
                  </v-col>

                  <v-col cols="7" v-show="option_1 === 'sensor'">
                    <v-text-field
                      v-model="option_2"
                      :rules="[rules.required]"
                      label="Enter the old ID"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="7" v-show="option_1 === 'sensor'">
                    <v-text-field
                      v-model="option_3"
                      :rules="[rules.required]"
                      label="Enter the new ID"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="7" v-show="option_1 === 'data'">
                    <v-select
                      v-model="option_4"
                      :rules="[rules.required]"
                      :items="update_sensor"
                      label="Select a sensor"
                      outlined
                    ></v-select>
                  </v-col>

                  <v-col cols="7" v-show="option_1 === 'data'">
                    <v-text-field
                      v-model="option_5"
                      :rules="[rules.required]"
                      label="Enter a timestamp"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="7" v-show="option_1 === 'data'">
                    <v-text-field
                      v-model="option_6"
                      :rules="[rules.required]"
                      type="number"
                      label="Enter a new value"
                      outlined
                    ></v-text-field>
                  </v-col>

                  <v-col cols="7" align="center">
                    <v-btn
                      v-on:click="updateData()"
                      class="warning"
                      dark
                      rounded
                      outlined
                    >
                      Update values
                    </v-btn>
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
import axios from 'axios';

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text="Data succesvol gedelete"] - Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {Array<String>} [update_types="value"] - Selects what the user wants to edit
 * @vue-data {Array<String>} [update_sensor="value"] - Selects the sensor id
 *
 * @vue-data {String} [option_1=null] - Asks user what they want to edit
 * @vue-data {String} [option_2=null] - Asks user to input the old ID of the sensor
 * @vue-data {String} [option_3=null] - Asks user to input a new ID for the sensor
 * @vue-data {String} [option_4=null] - Asks user to select a sensor
 * @vue-data {Timestamp} [option_5=null] - Asks user to input the new timestamp
 * @vue-data {Number} [option_6=null] - Asks user to input a new value for the sensor
 *
 * @vue-data {Object} [rules] - Applies validation to the form
 */

export default {
  /* eslint-disable */
  data() {
    return {
      //loading overlay
      overlay: false,

      //snackbar config
      succes_snackbar: false,
      succes_text: 'Data edited!',

      //snackbar config
      failure_snackbar: false,
      failure_text: 'Something went wrong !',

      //properties for the form
      update_types: ['sensor', 'data'],
      update_sensor: ['SENSOR_001_TEMP', 'SENSOR_002_LIGHT'],

      option_1: null,
      option_2: null,
      option_3: null,
      option_4: null,
      option_5: null,
      option_6: null,

      //validate form
      rules: {
        required: (value) => !!value || 'Dit veld is vereist.',
      },
    };
  },

  methods: {
    /**
     * Edits the data depending on what the user selected / inputted
     */
    updateData() {
      this.overlay = true;
      axios
        .put(this.$API_URL + '/update', null, {
          params: {
            type: this.option_1,
            oldid: this.option_2,
            newid: this.option_3,
            id: this.option_4,
            time: this.option_5,
            val: this.option_6,
          },
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
          this.$refs.updateForm.reset();
          this.$refs.updateForm.resetValidation();
        });
    },
  },
};
</script>

<style></style>
