<template>
  <div id="top">
    <h1>Welcome to GrayTabby!</h1>
    <div id="debug">
      Debugging<br>
      Bytes in storage: {{approxSize()}}<br>
      <button @click="double()">double</button>
      <br>
    </div>
    <div v-for="(group, gidx) in groups">
      <span id="heading">
        <b>{{new Date(group.date * 1000).toLocaleString()}}</b>
        <span id="info">
        ({{group.tabs.length}} tab{{group.tabs.length > 1 ? 's': ''}})
        </span>
      </span>
      <ul>
        <li v-for="(tab, tidx) in group.tabs" :key="tab.key"
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

  import {moreTabs, pageLoad} from "../brokers";
  import {faviconLocation} from "../utils";
  import {createTab} from "../ext";
  import imgWithFallback from './ImgWithFallback.vue';
  import {TabGroup, TabSummary} from "../../@types/graytabby";
  import {tabsStore} from "../storage";

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
      this.groups = tabsStore.get() || [];
      this.groups = this.groups.filter(g => g.tabs.length > 0)
      moreTabs.sub(this.processMoreTabs);
      await pageLoad.pub(null);
    },
    methods: {
      processMoreTabs: function(tabSummaries: TabSummary[]) {
        let now = new Date();
        let group: TabGroup = {
          tabs: tabSummaries,
          key: nanoid(9),
          date: Math.round(now.getTime() / 1000)
        };
        let counter = 0;
        for (let tab of group.tabs) {
          tab.key = group.key + counter++;
        }
        this.groups.unshift(group);
      },
      clickLink: function (event: Event, url: string, gidx: number, tidx: number) {
        event.preventDefault();
        this.groups[gidx].tabs.splice(tidx, 1);
        if (this.groups[gidx].tabs.length == 0) {
          this.groups.splice(gidx, 1);
        }
        createTab({url, active: false});
      },
      approxSize: function () {
        return tabsStore.approxSize;
      },
      double: async function () {
        for (let tabGroup of [...this.groups]) {
          this.processMoreTabs(tabGroup.tabs);
        }
      },
      faviconLocation
    },
    watch: {
      groups: {
        handler: async function (newGroups) {
          let start = new Date().getTime();
          tabsStore.put(newGroups);
          console.log('put in', new Date().getTime() - start)
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

  /*#heading {*/
  /*  font-family: Palatino, serif;*/
  /*}*/

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

  #debug {
    float: right;
    padding: 10px;
    margin: 7px auto;
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
  }
</style>
