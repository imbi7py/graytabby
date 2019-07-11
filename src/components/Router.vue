<template>
  <div>
    myapp
    <router-link to="/">go home</router-link>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import VueRouter from 'vue-router';
  import home from './home.vue';
  import options from './options.vue';

  Vue.use(VueRouter);

  // const router = new VueRouter({
  //   routes: [
  //     { path: '/', component: options},
  //     { path: '/options', component: options},
  //   ]
  // });
  //
  // export default Vue.extend({
  //   router: router,
  //   components: {
  //     home, options
  //   }
  // });

  export default new VueRouter({
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


</script>

<style scoped>

</style>
