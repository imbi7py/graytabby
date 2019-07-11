<template>
  <div id="top">
    <h1>Welcome to GrayTabby!</h1>
    <router-link to="/options">opitons</router-link>
    <div v-for="(group, gidx) in groups">
      <span id="heading">
        <b>{{group.title}}</b>
        <span id="info">
        ({{group.tabs.length}} tab{{group.tabs.length > 1 ? 's': ''}})
        </span>
      </span>
      <ul>
        <li v-for="(tab, tidx) in group.tabs" :key="tab.displayKey"
            :data-parent-gid="gidx">
          <img-with-fallback :src="faviconLocation(tab.url)"
                             fallback="/assets/img/logo.png"
                             width="16" height="16"/>
          <a :href="tab.url"
             @click.left="clickLink($event, tab.url, gidx, tidx)"
          >{{tab.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import nanoid from 'nanoid';

  import {homePage, moreTabs, pageLoad} from "../brokers";
  import {groupsFromLocalStorage, groupsToLocalStorage, faviconLocation} from "../utils";
  import {createTab} from "../ext";
  import imgWithFallback from './ImgWithFallback.vue';
  import {TabGroup} from "../../@types/graytabby";

  export default Vue.extend({
    data: function () {
      return {
        /**
         * A list of TabGroups, representing all the user's archived tabs.
         */
        groups: <TabGroup[]>[]
      }
    },
    mounted: async function () {
      this.groups = groupsFromLocalStorage();
      moreTabs.sub(group => {
          for (let tab of group.tabs) tab.displayKey = nanoid();
          this.groups.unshift(group);
        }
      );
      await pageLoad.pub(null);
      console.log('sending', this.$route.fullPath);
      await homePage.pub(this.$route.fullPath);
    },
    methods: {
      clickLink: function (event: Event, url: string, gidx: number, tidx: number) {
        event.preventDefault();
        this.groups[gidx].tabs.splice(tidx, 1);
        if (this.groups[gidx].tabs.length == 0) {
          this.groups.splice(gidx, 1);
        }
        createTab({url, active: false});
      },
      faviconLocation
    },
    watch: {
      groups: {
        handler: function (newGroups) {
          groupsToLocalStorage(newGroups);
        },
        deep: true
      }
    },
    components: {
      imgWithFallback
    }
  });

</script>

<style scoped>
  #top {
    font-size: 12px;
  }

  #heading {
    font-family: Palatino, serif;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  a {
    font-family: Arial, sans-serif;
    padding-left: 5px;
  }

  #info {
    padding-left: 10px;
    color: gray;
  }
</style>
