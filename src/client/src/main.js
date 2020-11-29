import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { fb } from './firebase';

import '../src/assets/scss/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlus,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faPlus, faPencilAlt, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.prototype.$API_URL = `http://${document.domain}:3000`;

let app;
fb.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
