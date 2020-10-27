<!-- @format -->
<!-- eslint-disable -->
<template>
  <v-navigation-drawer
    v-model="primaryDrawer.model"
    :permanent="primaryDrawer.type === 'permanent'"
    :clipped="primaryDrawer.clipped"
    color="rgb(29, 51, 69)"
    app
    overflow
    class="elevation-2"
  >
    <v-layout column align-center class="text-center">
      <v-flex class="ma-5">
        <h3 class="white--text heading mt-4">
          Jens Vanhulst
        </h3>
        <h4 class="white--text">electronica - ict</h4>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>
    <v-list nav>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon dark>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text" @click="$router.push('/')"
            >Home</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-show="$route.path === '/'">
        <v-list-item-icon>
          <v-icon dark>mdi-briefcase-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">My work</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link v-show="$route.path === '/'">
        <v-list-item-icon>
          <v-icon dark>mdi-message-text-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">Contact</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-show="$route.path !== '/'"
        @click="$router.push('/iot/')"
      >
        <v-list-item-icon>
          <v-icon dark>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-show="$route.path !== '/'"
        @click="$router.push('/iot/individualdata')"
      >
        <v-list-item-icon>
          <v-icon dark>mdi-table</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text"
            >Data per sensor</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-show="$route.path !== '/'"
        @click="$router.push('/iot/graphs')"
      >
        <v-list-item-icon>
          <v-icon dark>mdi-graphql</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text">Grafieken</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        v-show="$route.path !== '/'"
        @click="$router.push('/iot/period')"
      >
        <v-list-item-icon>
          <v-icon dark>mdi-graph</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="white--text"
            >Periode grafiek</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: function() {
    return {
      drawers: "Permanent",
      primaryDrawer: {
        model: null,
        type: "Permanent",
        clipped: true
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  z-index: 10 !important;
}
</style>
