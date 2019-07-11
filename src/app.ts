import Vue from 'vue';
import VueRouter from 'vue-router';
// import router from './components/Router.vue'
import options from 'components/Options.vue';
import home from 'components/Home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: home
    },
    {
      path: '/options',
      name: 'options',
      component: options
    }
  ]
});

new Vue({
  el: "#app",
  router: router,
  components: {home, options},
  render(h) {
    return h('home');
  }
});
