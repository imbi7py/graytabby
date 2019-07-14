<template>
  <div id="top">
    <h1>Welcome to GrayTabby!</h1>
    <div id="debug">
      Debugging<br>
      Bytes in storage: {{approxSize()}}<br>
      Num tabs: {{numTabs()}}
      <button @click="double()">double</button>
      <br>
    </div>
    <DynamicScroller  :items="groups" key-field="key" :min-item-size="1">
      <template v-slot="{item, index, active}">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index" :size-dependencies="[item.tabs]">
<!--      <div v-for="(group, gidx) in groups">-->
          <div>
      <span id="heading">
        <b>{{new Date(item.date * 1000).toLocaleString()}}</b>
        <span id="info">
        ({{item.tabs.length}} tab{{item.tabs.length > 1 ? 's': ''}})
        [{{index}} {{item.key}}]
        </span>
      </span>
        <ul>
          <li v-for="(tab, tidx) in item.tabs" :key="tab.key">
            <img-with-fallback :src="faviconLocation(tab.url)"
                               fallback="/assets/img/logo.png"
                               width="16" height="16"/>
            <a :href="tab.url"
               @click.left="clickLink($event, index, tidx)"
            >{{tab.title}}</a> [{{tab.key}}]
          </li>
        </ul>
<!--      </div>-->
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
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
      numTabs: function() {
        let sum = 0;
        for (let group of this.groups) sum += group.tabs.length;
        return sum;
      },
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
      clickLink: function (event: Event, gidx: number, tidx: number) {
        event.preventDefault();
        let deletedTab = this.groups[gidx].tabs.splice(tidx, 1)[0];
        if (this.groups[gidx].tabs.length == 0) {
          this.groups.splice(gidx, 1);
        }
        createTab({url: deletedTab.url, active: false});
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

  .scroller {
    height: 100%;
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

  #debug {
    float: right;
    padding: 10px;
    margin: 7px auto;
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
    position: fixed;
    z-index: 1000;
  }
</style>
