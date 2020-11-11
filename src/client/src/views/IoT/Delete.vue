<!-- @format -->
<!-- eslint-disable   -->
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
            <h2 class="text-center">Delete records from database:</h2>
          </v-col>
        </v-row>
        <v-row justify="center">
          <div class="form-container">
            <v-form ref="deleteForm">
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="7">
                    <v-select
                      v-model="option_1"
                      :rules="[rules.required]"
                      :items="delete_operations"
                      label="What do you want to delete?"
                      outlined
                    />
                  </v-col>
                  <v-col cols="7">
                    <v-select
                      v-model="option_2"
                      :rules="[rules.required]"
                      :items="delete_table"
                      label="Select a table"
                      outlined
                    />
                  </v-col>
                  <v-col cols="7">
                    <v-checkbox
                      class="pa-0 ma-0"
                      :rules="[rules.required]"
                      v-model="confirm"
                      label="Are you sure ?"
                    />
                  </v-col>
                  <v-col cols="7" align="center">
                    <v-btn
                      v-on:click="deleteData()"
                      class="error"
                      dark
                      rounded
                      outlined
                    >
                      Delete
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
 * @vue-data {Number} [timeout_5000=5000] - Sets the alert message to a timeout value (ms)
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text="Data succesvol gedelete"] - Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {Array<String>} [delete_operations="value"] - Selects the table option
 * @vue-data {Array<String>} [delete_table="value"] - Selects the table the user wants to delete
 *
 * @vue-data {String} [option_1=null] - Asks user what they want to delete
 * @vue-data {String} [option_2=null] - Asks user to select a table they want to clear
 * @vue-data {Boolean} [confirm=null] - Asks for confirmation of the user
 *
 *
 * @vue-data {Object} [rules] - Applies validation to the form
 */

export default {
  /* eslint-disable */
  data() {
    return {
      //loading overlay
      overlay: false,
      timeout: 5000,

      //snackbar config
      succes_snackbar: false,
      succes_text: 'Data deleted',

      //snackbar config
      failure_snackbar: false,
      failure_text: 'Something went wrong! Please try again.',

      //properties for the form
      delete_operations: ['table'],
      delete_table: ['SensorData', 'SensorOverview'],

      option_1: null,
      option_2: null,

      confirm: false,

      //validate form
      rules: {
        required: (value) => !!value || 'This field is required',
      },
    };
  },

  methods: {
    /**
     * Deletes data depending on the options of the form
     */
    deleteData() {
      if (this.confirm === true) {
        this.overlay = true;
        axios
          .delete(this.$API_URL + '/delete', {
            params: {
              type: this.option_1,
              table: this.option_2,
            },
          })
          .then((response) => {
            this.overlay = false;
            if (response.status === 200) {
              this.succes_snackbar = true;
              this.$refs.deleteForm.reset();
              this.$refs.deleteForm.resetValidation();
            } else if (response.status === 500) {
              this.failure_snackbar = true;
            }
          })
          .catch((error) => {
            this.failure_text = error.message;
            this.failure_snackbar = true;
          });
      } else {
        alert('Bevestig je bewerking aub.');
      }
    },
  },
};
</script>

<style></style>
