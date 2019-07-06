import {TabGroup, TabSummary} from "./types";

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

export function groupsFromLocalStorage(): TabGroup[] {
  let bytes = localStorage.getItem('groups');
  if (bytes == null) return [];
  let groups: TabGroup[] = JSON.parse(bytes);
  return groups.filter(g => g.date)
}

export function groupsToLocalStorage(groups: TabGroup[]) {
  localStorage.setItem('groups', JSON.stringify(groups));
}

export function getDomain(url: string): string {
  return new URL(url).hostname
}

export function faviconLocation(url: string): string {
  return 'https://www.google.com/s2/favicons?domain=' + getDomain(url);
}
