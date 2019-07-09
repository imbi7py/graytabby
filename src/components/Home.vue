<template>
  <div id="top">
    <h1>Welcome to GrayTabby!</h1>
    <div v-for="(group, gidx) in groups">
      <span id="heading">
        <b>{{group.title}}</b>
        <span id="info">
        ({{group.tabs.length}} tab{{group.tabs.length > 1 ? 's': ''}})
        </span>
      </span>
      <draggable :list="group.tabs" tag="ul" group="links">
        <transition-group :name="transitionName" v-on:before-leave="beforeLeave">
          <!-- Remember the parent group ID on the elem, so we can reference it in the beforeLeave callback.-->
          <li v-for="(tab, tidx) in group.tabs" :key="tab.displayKey"
              :data-parent-gid="gidx">
            <img-with-fallback :src="faviconLocation(tab.url)"
                               fallback="/assets/img/logo.png"
                               width="16" height="16"/>
            <a :href="tab.url"
               @click.left="clickLink($event, tab.url, gidx, tidx)"
            >{{tab.title}}</a>
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import draggable from 'vuedraggable';
  import nanoid from 'nanoid';

  import {moreTabs, pageLoad} from "../brokers";
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
        groups: <TabGroup[]>[],
        /**
         * Bound to the transition groups that surround the lists. Patched
         * before operations so that the transition effect is off during
         * new tab receipt, but on during drag and drop.
         */
        transitionName: 'fadeLeft'
      }
    },
    mounted: async function () {
      this.groups = groupsFromLocalStorage();
      moreTabs.sub(group => this.patchTransitionFor('',
        () => {
          for (let tab of group.tabs) tab.displayKey = nanoid();
          this.groups.unshift(group);
        }
      ));
      await pageLoad.pub(null);
    },
    methods: {
      patchTransitionFor(name: string, callable: () => any) {
        let backup = this.transitionName;
        this.transitionName = name;
        callable();
        this.$nextTick(() => this.transitionName = backup);
      },
      beforeLeave: function (el: Element) {
        let idx = parseInt(el.getAttribute('data-parent-gid'));
        if (this.groups[idx].tabs.length === 0) {
          this.patchTransitionFor('', () => this.groups.splice(idx, 1));
        }
      },
      clickLink: function (event: Event, url: string, gidx: number, tidx: number) {
        event.preventDefault();
        this.patchTransitionFor('fadeRight', () => this.groups[gidx].tabs.splice(tidx, 1));
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
      draggable,
      imgWithFallback
    }
  });

</script>

<style scoped>
  @import '../../node_modules/vue2-animate/dist/vue2-animate.min.css';

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

  /*See https://vuejs.org/v2/guide/transitions.html#Transitioning-Between-Components*/
  .fadeLeft-move {
    transition: transform .5s;
  }

</style>
