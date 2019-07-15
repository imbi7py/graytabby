import {tabsStore} from "./storage";
import {KeyedTabSummary, TabGroup, TabSummary} from "../@types/graytabby";
import {faviconLocation} from "./utils";
import {moreTabs} from "./brokers";
import nanoid = require("nanoid");
import {createTab} from "./ext";

function makeElement(type: string,
                     attrs: { [key: string]: string } = {},
                     text?: string): Element {
  let elem = document.createElement(type);
  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
  if (text !== undefined) {
    elem.innerText = text;
  }
  return elem;
}

function linkRow(group: TabGroup, tab: KeyedTabSummary): Element {
  let row = makeElement('div');
  row.appendChild(renderFavicon(tab.url));
  let a = <HTMLAnchorElement>row.appendChild(
    makeElement('a', {href: tab.url, target: '_new'}, tab.title));
  a.onclick = event => {
    event.preventDefault();
    createTab({url: tab.url, active: false});
    row.parentElement.removeChild(row);
    let idx = group.tabs.findIndex(t => t.key === tab.key);
    group.tabs.splice(idx, 1);
    tabsStore.put(tabGroups);
  };
  return row;
}

function renderGroup(group: TabGroup): Element {
  let div = makeElement('div');
  div.appendChild(makeElement('span', {}, new Date(group.date * 1000).toLocaleString()));
  let ul = div.appendChild(document.createElement('ul'));
  for (let tab of group.tabs) {
    let li = ul.appendChild(makeElement('li'));
    // li.appendChild(renderFavicon(tab.url));
    // li.appendChild(makeElement('a', {href: tab.url, target: '_new'}, tab.title));
    li.appendChild(linkRow(group, tab));
  }
  return div;
}

function renderFavicon(url: string): Element {
  let loc = faviconLocation(url);
  return makeElement('img', {
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

let tabGroups = tabsStore.get();
let groupDom = document.querySelector('#groupsDiv');

if (tabGroups) {
  for (let group of tabGroups) groupDom.appendChild(renderGroup(group));
}

function ingestTabs(tabSummaries: TabSummary[]) {
  let groupKey = nanoid(9);
  let counter = 0;
  let group: TabGroup = {
    tabs: tabSummaries.map(ts => {return {...ts, key: groupKey + counter++}}),
    key: groupKey,
    date: Math.round(new Date().getTime() / 1000)
  };
  console.log(group.tabs.map(x => x.key));
  tabGroups.unshift(group);
  prependInsideContainer(groupDom, renderGroup(group));
  tabsStore.put(tabGroups);
}

moreTabs.sub(ingestTabs);
