<!-- @format -->
<!-- eslint-disable -->
<template>
  <v-app class="white light">
    <sidebar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import sidebar from "./components/sidebar";
export default {
  components: {
    sidebar
  }
};
</script>
