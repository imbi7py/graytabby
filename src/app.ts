import Vue from 'vue';
import app from './components/App.vue'

import VueVirtualScroller from 'vue-virtual-scroller'

Vue.use(VueVirtualScroller);

new Vue({
  el: "#app",
  components: {'app': app},
  render(h) {
    return h('app');
  }
});
