import Vue from 'vue';
import app from './components/App.vue'
import router from './router'

new Vue({
  el: "#app",
  router: router,
  components: {'app': app},
  render(h) {
    return h('app');
  }
});
