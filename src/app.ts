import Vue from 'vue';
import app from './components/App.vue'
import router from './router'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueMaterial);

new Vue({
  el: "#app",
  router: router,
  components: {'app': app},
  render(h) {
    return h('app');
  }
});
