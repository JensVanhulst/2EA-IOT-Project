<!-- @format -->
<!--  eslint-disable-->
<template>
  <v-col cols="4" class="d-flex align-items-stretch">
    <v-card class="mx-auto my-12" max-width="280">
      <v-img height="250" :src="require(`../assets/images/${imageUrl}`)" />
      <v-card-title>{{ project_title }}</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <div>{{ project_description }}</div>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4" />

      <v-card-actions>
        <v-btn color="black" text v-on:click="$router.push(`${project_link}`)">
          View
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "Project",
  props: ["poject_title", "project_description", "image-url", "project_link"]
};
</script>

<style></style>
