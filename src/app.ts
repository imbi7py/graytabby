import Vue from 'vue';
import app from './components/App.vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.use(VueVirtualScroller);

new Vue({
  el: "#app",
  components: {'app': app},
  render(h) {
    return h('app');
  }
});
