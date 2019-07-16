/**
 * Importing this module (in an HTML page or otherwise) will initialize GrayTabby
 * data structures and will attach the GrayTabby app to the HTML element with id = 'app'.
 */

import {optionsStore, tabsStore} from "./storage";
import {KeyedTabSummary, TabGroup, TabSummary} from "../@types/graytabby";
import {faviconLocation, makeElement, snip} from "./utils";
import {moreTabs, pageLoad} from "./brokers";
import {createTab} from "./ext";
import nanoid = require("nanoid");

/**
 * The data representation of a user's graytabby state.
 */
let tabGroups = tabsStore.get() || [];
let options = optionsStore.get() || {tabLimit: 6000};

function totalTabs(): number {
  return tabGroups.reduce(
    (acc, cur) => acc + cur.tabs.length, 0
  )
}

function removeGroup(group: TabGroup): Element {
  let found = document.querySelector(`[id='${group.key}']`);
  groupsNode.removeChild(found);
  snip(tabGroups, tg => tg.key === group.key);
  return found;
}

/**
 * The root node for the whole application.
 */
let appNode = <HTMLDivElement>document.querySelector('#app');
appNode.appendChild(makeElement('h1', {}, 'welcome to graytabby'));

/**
 * Node for displaying high level information to the user.
 */
let infoNode = appNode.appendChild(
  <HTMLParagraphElement>makeElement('p')
);

function updateInfo(): void {
  infoNode.innerText = 'Total tabs: ' + totalTabs().toString();
}

/**
 * The root node of the list of tab groups.
 */
let groupsNode = appNode.appendChild(
  <HTMLDivElement>makeElement('div'));

function renderLinkRow(group: TabGroup, tab: KeyedTabSummary): HTMLDivElement {
  let row = <HTMLDivElement>makeElement('div');
  row.appendChild(renderFavicon(tab.url));
  let a = <HTMLAnchorElement>row.appendChild(
    makeElement('a', {href: tab.url}, tab.title));
  a.onclick = event => {
    event.preventDefault();
    createTab({url: tab.url, active: false});
    row.parentElement.removeChild(row);
    snip(group.tabs, t => t.key === tab.key);
    if (group.tabs.length == 0) removeGroup(group);
    tabsStore.put(tabGroups);
    updateInfo();
  };
  return row;
}

function renderGroup(group: TabGroup): HTMLDivElement {
  let div = <HTMLDivElement>makeElement('div', {'id': group.key});
  div.appendChild(makeElement('span', {}, new Date(group.date * 1000).toLocaleString()));
  let ul = div.appendChild(makeElement('ul'));
  for (let tab of group.tabs) {
    let li = ul.appendChild(makeElement('li'));
    li.appendChild(renderLinkRow(group, tab));
  }
  return div;
}

function renderFavicon(url: string): HTMLImageElement {
  let loc = faviconLocation(url);
  return <HTMLImageElement>makeElement('img', {
    src: loc,
    width: '16',
    height: '16'
  });
}

function prependInsideContainer(parent: Element, child: Element): Element {
  if (parent.firstChild == null) parent.appendChild(child);
  else parent.insertBefore(child, parent.firstChild);
  return child;
}

if (tabGroups) {
  for (let group of tabGroups) groupsNode.appendChild(renderGroup(group));
}

function ingestTabs(tabSummaries: TabSummary[]) {
  let groupKey = nanoid(9);
  let counter = 0;
  let group: TabGroup = {
    tabs: tabSummaries.map(ts => {
      return {...ts, key: groupKey + counter++}
    }),
    key: groupKey,
    date: Math.round(new Date().getTime() / 1000)
  };
  tabGroups.unshift(group);
  prependInsideContainer(groupsNode, renderGroup(group));

  let lastRemoved: TabGroup;
  while (totalTabs() > options.tabLimit) {
    lastRemoved = tabGroups[tabGroups.length - 1];
    removeGroup(lastRemoved);
  }
  if (lastRemoved !== undefined) {
    tabGroups.push(lastRemoved);
    groupsNode.appendChild(renderGroup(lastRemoved));
  }

  tabsStore.put(tabGroups);
  updateInfo();
}

moreTabs.sub(ingestTabs);
updateInfo();


// Debugging...
function double() {
  for (let group of [...tabGroups]) {
    ingestTabs(group.tabs);
  }
}

function empty() {
  tabsStore.put([]);
  window.location.reload();
}

// @ts-ignore
window.double = double;
// @ts-ignore
window.empty = empty;
// @ts-ignore
window.setTabLimit = function(amt: number) {
  options.tabLimit = amt;
  optionsStore.put(options);
};

pageLoad.pub(null);
