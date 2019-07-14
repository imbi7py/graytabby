<template>
  <div id="top">
    <div id="debug">
      Debugging<br>
      Bytes in storage: {{approxSize()}}<br>
      Num tabs: {{numTabs()}}
      <button @click="double()">double</button>
      <button @click="clear()">clear</button>
      <br>
    </div>
    <h1>Welcome to GrayTabby!</h1>
    <DynamicScroller :items="groups" class="scroller" :min-item-size="1" :pageMode="true" keyField="key">
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.tabs.length]"
          :data-index="index">
          <tab-section :group="item" :key="item.key" :removeFromParent="() => removeGroup(index)"></tab-section>
          <div class="under"></div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import nanoid from 'nanoid';

  import {moreTabs, pageLoad} from "../brokers";
  import {createTab} from "../ext";
  import imgWithFallback from './ImgWithFallback.vue';
  import tabSection from './TabSection.vue';
  import {TabGroup, TabSummary} from "../../@types/graytabby";
  import {localStorageUsage, tabsStore} from "../storage";

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
      this.groups = this.groups.filter(g => g.tabs.length > 0);
      moreTabs.sub(this.processMoreTabs);
      await pageLoad.pub(null);
    },
    methods: {
      removeGroup: function (gidx: number) {
        this.groups.splice(gidx, 1);
      },
      numTabs: function () {
        let sum = 0;
        for (let group of this.groups) sum += group.tabs.length;
        return sum;
      },
      processMoreTabs: function (tabSummaries: TabSummary[]) {
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
        return localStorageUsage().toFixed(2);
      },
      // Debug only...
      double: async function () {
        for (let tabGroup of [...this.groups]) {
          let summaries: TabSummary[] = [];
          for (let tabSummary of tabGroup.tabs) {
            summaries.push({...tabSummary});
          }
          this.processMoreTabs(summaries);
        }
      },
      clear: function () {
        tabsStore.put([]);
        window.location.reload();
      }
    },
    watch: {
      groups: {
        handler: async function (newGroups) {
          tabsStore.put(newGroups);
        },
        deep: true
      }
    },
    components: {
      imgWithFallback,
      tabSection
    }
  });

</script>

<style>
</style>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');

  #top {
    font-family: 'Roboto Mono', monospace;
  }

  #debug {
    padding: 10px;
    margin: 7px auto;
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
  }

  .under {
    padding-bottom: 10px;
  }

  .scroller {
    height: 100%;
    /*height: 500px;*/
  }
</style>
