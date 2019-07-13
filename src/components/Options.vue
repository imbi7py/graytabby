<template>
  <div>
    options<br>
    {{show()}}
  </div>
</template>

<script>
  import Vue from 'vue';
  import {tabsStore} from "../storage";

  export default Vue.extend({
    methods: {
      show: function() {
        return tabsStore.get();
      }
    }
  });
</script>

<style scoped>
</style>
