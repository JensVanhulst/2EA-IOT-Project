<!-- @format -->
<!-- eslint-disable-->
<template>
  <div class="authentication">
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

    <v-snackbar v-model="failure_snackbar" color="success" timeout="2000">
      {{ failure_snackbar }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="failure_snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <section id="auth-section">
      <v-container fluid>
        <v-row class="pt-10">
          <v-col cols="12">
            <h2 class="text-center">Registreer</h2>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="8">
            <div class="form-container sign-in-container">
              <v-container bg fill-height grid-list-md text-xs-center>
                <v-row wrap align-center justify="center">
                  <v-col cols="12">
                    <v-form ref="signUpForm">
                      <v-container fluid>
                        <v-row justify="center">
                          <v-col cols="10" class="pa-0 ma-1">
                            <v-text-field
                              label="Name"
                              v-model="signUpName"
                              :rules="[rules.required]"
                              :counter="20"
                              outlined
                            />
                          </v-col>

                          <v-col cols="10" class="pa-0 ma-1">
                            <v-text-field
                              label="Email"
                              v-model="signUpEmail"
                              :rules="[rules.required, rules.email]"
                              outlined
                            />
                          </v-col>

                          <v-col cols="10" class="pa-0 ma-1">
                            <v-text-field
                              label="Wachtwoord"
                              v-model="signUpPassword"
                              :rules="[rules.required]"
                              :append-icon="
                                showPassword ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              :type="showPassword ? 'text' : 'password'"
                              @click:append="showPassword = !showPassword"
                              outlined
                            />
                          </v-col>

                          <v-col cols="10" class="pa-0 ma-1 text-center">
                            <v-btn
                              disabled
                              v-on:click="register"
                              outlined
                              rounded
                            >
                              Registreer nu !
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { fb } from '../firebase';

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text="Data succesvol ingelogd"] - Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {String} [signUpName=null] - Input for the user's name
 * @vue-data {String} [signUpEmail=null] - Input for the user's email
 * @vue-data {String} [signUpPassword=null] - Input for the user's password
 * @vue-data {Boolean} [showPassword=false] - Checkbox to show/hide password
 *
 * @vue-data {Object} [rules] - Applies validation to the form
 */

export default {
  /* eslint-disable */
  name: 'register',

  data: function () {
    return {
      overlay: false,

      //snackbar config
      succes_snackbar: false,
      succes_text: 'Succesvol geregistreerd',

      //snackbar config
      failure_snackbar: false,
      failure_text: 'Oeps er is iets misgelopen probeer later opnieuw',

      //Formdata
      signUpName: null,
      signUpEmail: null,
      signUpPassword: null,
      showPassword: false,

      rules: {
        required: (value) => !!value || 'Dit veld is vereist.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Ongeldig emailadress.';
        },
      },
    };
  },

  methods: {
    /**
     * Registers a user in firebase depending on the credentials
     */
    register() {
      if (this.$refs.signUpForm.validate()) {
        this.overlay = true;
        fb.auth()
          .createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
          .then((user) => {
            this.overlay = false;
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              alert('Password to weak');
              this.overlay = false;
            } else {
              alert(errorMessage);
            }
          });
      }
    },
  },
};
</script>

<style></style>
