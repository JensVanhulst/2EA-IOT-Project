<!-- @format -->
<!-- eslint-disable-->
<template>
  <div class="authentication">
    <v-overlay :value="overlay" z-index="1000">
      <v-progress-circular indeterminate size="64" width="10" color="rgb(29, 51, 69)"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="succes_snackbar" color="success" timeout="2000" top>
      {{ succes_text }}
      <v-btn dark text @click="succes_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="failure_snackbar" color="error" timeout="5000" top>
      {{ failure_text }}
      <v-btn dark text @click="failure_snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <section id="auth-section">
      <v-container fluid>
        <v-row class="pt-10">
          <v-col cols="12">
            <h2 class="text-center">Login om te kunnen bewerken.</h2>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="8">
            <div class="form-container">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-form ref="signInForm">
                      <v-container fluid>
                        <v-row justify="center">
                          <v-col cols="10" class="pa-0 ma-1">
                            <v-text-field v-model="signInEmail" :rules="[rules.required, rules.email]" label="E-mail" outlined></v-text-field>
                          </v-col>
                          <v-col cols="10" class="pa-0 ma-1">
                            <v-text-field
                              label="Wachtwoord"
                              v-model="signInPassword"
                              :rules="[rules.required]"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              @click:append="showPassword = !showPassword"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="10" class="pa-0 ma-1 text-center">
                            <v-btn v-on:click="login" outlined rounded> Login</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-col>
                  <v-col cols="6" class="text-center">
                    <a href="#" class="text-center red--text">Wachtwoord vergeten ?</a>
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
/* eslint-disable */
import { fb } from "../firebase";

/**
 * @vue-data {Boolean} [overlay=false] - Triggers the loading overlay
 * @vue-data {Number} [timeout_5000=5000] - Sets the alert message to a timeout value (ms)
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text="Data succesvol ingelogd"] - Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {String} [signInEmail=null] - Input for the user's email
 * @vue-data {String} [signInPassword=null] - Input for the user's password
 * @vue-data {Boolean} [showPassword=false] - Checkbox to show/hide password
 *
 * @vue-data {Object} [rules] - Applies validation to the form
 */
export default {
  name: "login",
  data: function() {
    return {
      overlay: false,

      //snackbar config
      succes_snackbar: false,
      succes_text: "Succesvol ingelogd",

      //snackbar config
      failure_snackbar: false,
      failure_text: "Oeps er is iets misgelopen probeer later opnieuw",

      signInEmail: null,
      signInPassword: null,
      showPassword: false,

      //Form validation
      rules: {
        required: (value) => !!value || "Dit veld is vereist.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Ongeldig emailadress.";
        }
      }
    };
  },

  methods: {
    /**
     * Logs a user in after validating the form
     */
    login() {
      if (this.$refs.signInForm.validate()) {
        this.overlay = true;
        fb.auth()
          .signInWithEmailAndPassword(this.signInEmail, this.signInPassword)
          .then((user) => {
            this.overlay = false;
            this.succes_snackbar = true;
            this.$router.go("/iot");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/weak-password") {
              alert("Password to weak");
            } else {
              alert(errorMessage);
            }
          })
          .finally(() => {
            this.overlay = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
