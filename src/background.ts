import {actionClickHandler, closeTabs, createTab, getAllTabs, getURL, updateTab} from "./ext";
import {moreTabs} from "./brokers";
import {archivePlan} from "./archive";


async function clickHandler() {
  const allTabs = await getAllTabs();
  const homeURL = getURL('home.html');
  let [homeTab, toArchiveTabs, toCloseTabs] = archivePlan(allTabs, homeURL);
  if (!homeTab) homeTab = await createTab({active: true, url: 'home.html'});
  await closeTabs(toArchiveTabs.map(t => t.id));
  await closeTabs(toCloseTabs.map(t => t.id));
  let focus = updateTab(homeTab.id, {active: true});
  if (toArchiveTabs.length > 0) {
    let now = new Date();
    await moreTabs.pub({
      date: now,
      title: now.toLocaleString(),
      tabs: toArchiveTabs
    });
  }
  await focus;
}

actionClickHandler(clickHandler);
