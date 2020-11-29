<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer.model"
      :permanent="drawer.type === 'permanent'"
      color="rgb(29, 51, 69)"
      app
      overflow
      class="elevation-2"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title white--text">
            Jens Vanhulst
          </v-list-item-title>
          <v-list-item-subtitle class="white--text">
            Elektronica-ICT
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list nav dark>
        <v-list-item
          v-for="(item, i) in drawer.routes"
          :key="i"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon dark>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 text-center white--text">
          🏗 with ❤️ <br />
          by Jens Vanhulst
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app fixed>
      <v-spacer />
      <v-toolbar-items>
        <v-btn v-if="isLoggedIn" text> Welcome {{ currentUser }}</v-btn>
        <v-btn v-if="!isLoggedIn" @click="$router.push('/login')" text>
          Login
        </v-btn>
        <v-btn v-if="!isLoggedIn" @click="$router.push('/register')" text>
          Register
        </v-btn>
        <v-btn v-if="isLoggedIn" v-on:click="logout" text>Log out</v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="primary" dark v-bind="attrs" v-on="on">
              Documentation
            </v-btn>
          </template>
          <v-list>
            <v-list-item link @click="goToDocs(`/docs/api`)">
              <v-list-item-title>API</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="goToDocs('/docs/client')">
              <v-list-item-title>client</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-snackbar v-model="succes_snackbar" color="success" timeout="1000">
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

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
/**
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
import { fb } from './firebase';

export default {
  data: () => {
    return {
      isLoggedIn: false,
      currentUser: false,

      //snackbar config
      succes_snackbar: false,
      succes_text: 'Signed out succesfully',

      //snackbar config
      failure_snackbar: false,
      failure_text: 'Failure. Please Try again',

      drawer: {
        model: null,
        type: 'Permanent',
        routes: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/' },
          {
            title: 'Individual data',
            icon: 'mdi-table',
            link: '/individual-data',
          },
          { title: 'Graphs', icon: 'mdi-graphql', link: '/graphs' },
          { title: 'Period graphs', icon: 'mdi-graph', link: 'period-graphs' },
        ],
      },
    };
  },

  methods: {
    goToDocs(url) {
      window.location = `http://${window.document.domain}${url}`;
    },
    /**
     * Logs the user out
     */
    logout: function () {
      fb.auth()
        .signOut()
        .then(() => {
          this.succes_snackbar = true;
          setTimeout(() => {
            this.$router.go({ path: '/' });
          }, 1100);
        });
    },
  },

  created() {
    //check if logged in
    if (fb.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = fb.auth().currentUser.email;
    }
  },
};
</script>
