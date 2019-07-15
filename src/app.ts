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

function snip<T>(arr: T[], func: (arg: T) => boolean): T[] {
  let idx = arr.findIndex(func);
  arr.splice(idx, 1);
  return arr;
}

function linkRow(group: TabGroup, tab: KeyedTabSummary): Element {
  let row = makeElement('div');
  row.appendChild(renderFavicon(tab.url));
  let a = <HTMLAnchorElement>row.appendChild(
    makeElement('a', {href: tab.url}, tab.title));
  a.onclick = event => {
    event.preventDefault();
    createTab({url: tab.url, active: false});
    row.parentElement.removeChild(row);
    snip(group.tabs, t => t.key === tab.key);
    if (group.tabs.length == 0) {
      snip(tabGroups, tg => tg.key === group.key);
      let found = document.querySelector(`[data-id='${group.key}']`);
      groupDom.removeChild(found);
    }
    tabsStore.put(tabGroups);
  };
  return row;
}

function renderGroup(group: TabGroup): Element {
  let div = makeElement('div', {'data-id': group.key});
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
  // tabGroups = tabGroups.filter(tg => tg.tabs.length > 0);
  for (let group of tabGroups) groupDom.appendChild(renderGroup(group));
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
  prependInsideContainer(groupDom, renderGroup(group));
  tabsStore.put(tabGroups);
}

moreTabs.sub(ingestTabs);

// document.querySelector('body').appendChild(
//   makeElement('debug', {id: '#debug'}).appendChild(
//     makeElement('span', {}, 'hi'))
// );

function updateInfo(): void {
  let info = <HTMLSpanElement>document.querySelector('#info');
  info.innerText = tabGroups.reduce(
    (acc, curr) => acc + curr.tabs.length, 0
  ).toString();
}

function injectDebug(): void {
  let body = document.querySelector('body');
  let debug = prependInsideContainer(body, makeElement('div', {id: 'debug'}));
  let button = <HTMLButtonElement>debug.appendChild(makeElement(
    'button', {}, 'double'
  ));
  button.onclick = event => {
    for (let group of [...tabGroups]) {
      ingestTabs(group.tabs)
      updateInfo();
    }
  };
}

injectDebug();
updateInfo();

