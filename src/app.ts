import Vue from 'vue';
import home from './components/Home.vue'

new Vue({
  el: "#app",
  components: {'home': home},
  render(h) {
    return h('home');
  }
});
