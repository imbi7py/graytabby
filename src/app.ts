import Vue from 'vue';
import app from './components/App.vue'

new Vue({
  el: "#app",
  components: {'app': app},
  render(h) {
    return h('app');
  }
});
