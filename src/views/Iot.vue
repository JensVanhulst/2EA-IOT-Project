<!-- @format -->
<!-- eslint-disable-->
<template>
  <div>
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

    <v-app-bar fixed>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="isLoggedIn" text> Welcome {{ currentUser }}</v-btn>
        <v-btn v-if="!isLoggedIn" @click="$router.push('/iot/login')" text>Login</v-btn>
        <v-btn v-if="!isLoggedIn" @click="$router.push('/iot/register')" text>Registreer</v-btn>
        <v-btn v-if="isLoggedIn" v-on:click="logout" text>Log uit</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <router-view />
  </div>
</template>

<script>
import { fb } from "../firebase";

/**
 * @vue-data {Number} [timeout_5000=5000] - Sets the alert message to a timeout value (ms)
 *
 * @vue-data {Boolean} [succes_snackbar=false] - Triggers the succes snackbar
 * @vue-data {String} [succes_text="Data succesvol ingelogd"] - Sets the succes message
 *
 * @vue-data {Boolean} [failure_snackbar=false] - Failure the succes snackbar
 * @vue-data {String} [failure_text="Oeps er is iets misgelopen..."] - Sets the failure message
 *
 * @vue-data {Boolean} [isLoggedIn=false] - Sets a flag if user is logged in so we can show sections based on if someone is logged in or not
 * @vue-data {Boolean} [currentUser=false] - Sets the currentUser to the Firebase user object
 *
 */

export default {
  name: "iot",

  data: function() {
    return {
      isLoggedIn: false,
      currentUser: false,

      //snackbar config
      succes_snackbar: false,
      succes_text: "Succesvol uitgelogd ",

      //snackbar config
      failure_snackbar: false,
      failure_text: "Oeps er is iets misgegaan",

      timeout: 5000
    };
  },

  methods: {
    /**
     * Logs the user out
     */
    logout: function() {
      fb.auth()
        .signOut()
        .then(() => {
          this.succes_snackbar = true;
          this.$router.go({ path: "iot" });
        });
    }
  },

  created() {
    //check if logged in
    if (fb.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = fb.auth().currentUser.email;
    }
  }
};
</script>

<style lang="scss" scoped></style>
