import {actionClickHandler, closeTabs, createTab, getAllTabs, getURL, updateTab} from "./ext";
import {moreTabs} from "./brokers";
import {archivePlan} from "./archive";
import {appURL} from "./utils";


async function clickHandler() {
  const allTabs = await getAllTabs();
  const homeUrl = appURL() + '#/';
  let [homeTab, toArchiveTabs, toCloseTabs] = archivePlan(allTabs, homeUrl);
  if (!homeTab) homeTab = await createTab({active: true, url: 'app.html'});
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
