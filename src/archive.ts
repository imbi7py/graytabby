import {TabSummary} from "./types";

function numberCmp(a: number | undefined, b: number | undefined): number {
  if (a == b && b == undefined) return 0;  // ...or one is truthy
  if (a == undefined) return 1;
  if (b == undefined) return -1;
  return a - b;
}

function tabCmp(a: TabSummary, b: TabSummary): number {
  if (a.pinned != b.pinned) return a.pinned ? -1 : 1;
  const winCmp = numberCmp(a.windowId, b.windowId);
  if (winCmp != 0) return winCmp;
  return numberCmp(a.id, b.id);
}

/**
 * Figures out which tabs get archived in to which home tab.
 *
 * Returns a tuple. First element is a TabSummary representing the home tab that results should
 * get merged in to, or null if no such tab exists. The second element is a list of tabs that
 * need to be archived. Third element is tabs that will just be closed and not archived.
 *
 * @param tabs All tabs which are candidates for archival.
 * @param homeURL The URL that indicates a tab is a GrayTabby home tab
 */
export function archivePlan(tabs: TabSummary[], homeURL: string): [TabSummary | null, TabSummary[], TabSummary[]] {
  tabs.sort(tabCmp);

  const tabsToArchive: TabSummary[] = [];
  const tabsToClose: TabSummary[] = [];
  let homeTab: TabSummary | null = null;

  for (const tab of tabs) {
    if (tab.url === homeURL) {
      if (!homeTab) homeTab = tab;  // Use existing hometab if possible.
      else tabsToArchive.push(tab);
    } else {
      if (tab.pinned) continue;
      if (tab.url.startsWith('about:')) tabsToClose.push(tab);
      else tabsToArchive.push(tab);
    }
  }

  return [homeTab, tabsToArchive, tabsToClose];
}
