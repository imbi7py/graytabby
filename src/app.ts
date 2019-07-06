import Vue from 'vue';
import home from './components/home.vue'

new Vue({
  el: "#app",
  components: {'home': home},
  render(h) {
    return h('home');
  }
});
