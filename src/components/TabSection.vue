<template>
  <div>
    <b>{{groupTitle}}</b>
    <span id="info">
        ({{group.tabs.length}} tab{{group.tabs.length > 1 ? 's': ''}})
    </span>
    <ul>
      <li v-for="(tab, tidx) in group.tabs" :key="tab.key">
        <img-with-fallback :src="faviconLocation(tab.url)"
                           fallback="/assets/img/logo.png"
                           width="16" height="16"/>
        <a :href="tab.url"
           @click.left="clickLink($event, tidx)"
        >{{tab.title.substring(0, 100) + (tab.title.length > 100 ? '...' : '')}}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ImgWithFallback from './ImgWithFallback.vue'
  import {createTab} from "../ext";
  import {faviconLocation} from "../utils";

  export default Vue.extend({
    props: ['group', 'removeFromParent'],
    methods: {
      clickLink: function (event: Event, tidx: number) {
        event.preventDefault();
        let tab = this.group.tabs.splice(tidx, 1)[0];
        createTab({url: tab.url, active: false});
        if (this.group.tabs.length == 0) this.removeFromParent();
      },
      faviconLocation
    },
    components: {
      ImgWithFallback
    },
    computed: {
      groupTitle: function () {
        return new Date(this.group.date * 1000).toLocaleString();
      }
    }
  });
</script>

<style scoped>
  #info {
    padding-left: 10px;
    color: gray;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  a {
    padding-left: 5px;
  }
</style>
