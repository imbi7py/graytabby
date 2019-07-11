<template>
  <div ref="home">
    <home :globalState="globalState" v-if="globalState.view === 'home'"/>
    <options :globalState="globalState" v-if="globalState.view === 'options'"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import home from './Home.vue'
  import options from'./Options.vue'
  import {GlobalState} from "../../@types/graytabby";

  export default Vue.extend({
    data: function () {
      return {
        globalState: {
          options: {
            fontSize: 0  // Change in mounted()
          },
          view: 'home'
        }
      }
    },
    mounted: function () {
      this.globalState.options.fontSize = 18;
    },
    components: {
      home,
      options
    },
    watch: {
      globalState: {
        handler: function (newState: GlobalState) {
          let body = document.getElementsByTagName('body')[0];
          body.setAttribute('style', 'font-size:' + newState.options.fontSize + 'px');
        },
        deep: true
      }
    }
  })
</script>

<style scoped>
</style>
