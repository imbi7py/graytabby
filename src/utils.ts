import {TabSummary} from "../@types/graytabby";
import {getURL} from "./ext";

export function castTab(nativeTab: any): TabSummary | null {
  if (nativeTab.windowId == undefined
    || nativeTab.id == undefined
    || nativeTab.url == undefined
    || nativeTab.title == undefined) {
    return null;
  }
  return {
    pinned: nativeTab.pinned,
    id: nativeTab.id,
    windowId: nativeTab.windowId,
    url: nativeTab.url,
    title: nativeTab.title
  }
}

export function appURL(): string {
  return getURL('app.html');
}

export function getDomain(url: string): string {
  return new URL(url).hostname
}

export function faviconLocation(url: string): string {
  return 'https://www.google.com/s2/favicons?domain=' + getDomain(url);
}

export function makeElement(type: string,
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

export function snip<T>(arr: T[], func: (arg: T) => boolean): T[] {
  let idx = arr.findIndex(func);
  arr.splice(idx, 1);
  return arr;
}
