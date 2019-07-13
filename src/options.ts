import Vue from 'vue';
import options from './components/Options.vue'

new Vue({
  el: "#options",
  components: {'options': options},
  render(h) {
    return h('options');
  }
});
