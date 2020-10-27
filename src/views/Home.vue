<!-- @format -->
<!-- eslint-disable-->
<template>
  <div id="home" app>
    <!-- intro start -->
    <section id="intro" class="d-flex align-items-center flex-wrap">
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="6" class="align-self-center">
            <div class="text-left">
              <h3>
                Hello my Name is
                <strong>Jens Vanhulst</strong>
              </h3>
              <br />
              <h4>
                I'm a 19 years old student @PXL Hasselt and i'm currently going for my bachelors degree in Electonics-ICT.
              </h4>
              <p class="text-black mb-5">
                On this site you can find all my projects that I've made during my life/school carreer.
              </p>
              <v-row justify="center">
                <v-col cols="12" xs="12" class="text-left">
                  <!--- Buttons for github and projects -->
                  <v-btn rounded outlined>Github</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" xs="12" md="6" class="text-center">
            <!--<a href="https://www.freepik.com/free-photos-vectors/background">Background vector created by freepik - www.freepik.com</a>-->
            <img src="@/assets/images/intro.png" alt="Working pc guy" width="90%" height="90%" class="img-responsive" />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- intro end -->

    <!-- MyWork start -->
    <section id="work" class="d-flex align-items-center flex-wrap">
      <v-container fluid>
        <v-row>
          <v-col md12 class="text-center">
            <h1 class="text-uppercase">My work</h1>
          </v-col>
        </v-row>
        <v-row>
          <Project
            project_title="Powersupply"
            project_description="Switching power supply with an output voltage of 30V MAX and a maximum current of 3A."
            image-url="powersupply.png"
            project_link="/"
          />
          <Project
            project_title="IoT Project"
            project_description="A project with arduino (uploading data), express server and vue.js framework."
            image-url="arduino.jpg"
            project_link="/iot"
          />
        </v-row>
      </v-container>
    </section>
    <!-- MyWork end -->

    <!-- Contact start -->
    <section id="contact" class="d-flex align-items-center flex-wrap">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="12" class="text-center">
            <h1 class="text-uppercase">Contact me</h1>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Contact end -->

    <!-- Footer start -->
    <footer id="footer" justify="center" :inset="footer.inset" app>
      <v-container fluid>
        <v-row>
          <v-col cols="12" xs12 md12 xl12 class="text-center">
            <span class="px-4">&copy; {{ new Date().getFullYear() }}</span
            ><em>Jens Vanhulst</em>
          </v-col>
        </v-row>
      </v-container>
    </footer>
    <!-- Footer end -->
  </div>
</template>

<script>
import Project from "../components/project";
export default {
  name: "home",
  components: {
    Project
  },
  data: function() {
    return {
      footer: {
        inset: true
      }
    };
  }
};
</script>
