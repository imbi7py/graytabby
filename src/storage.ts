import {isFireFox} from "./ext";
import {Options, TabGroup} from "../@types/graytabby";

class Store<PayloadT> {
  protected key: string;
  public approxSize: number;

  constructor(key: string) {
    this.key = key;
  }

  public put(value: PayloadT): Promise<void> {
    let entry: any = {};
    console.log(value);
    let strVal = JSON.stringify(value);
    this.approxSize = Buffer.byteLength(strVal, 'utf8');
    entry[this.key] = strVal;
    if (isFireFox()) return browser.storage.local.set(entry);
    return new Promise<void>(resolve => chrome.storage.local.set(entry, resolve))
  }

  public async get(): Promise<PayloadT | null> {
    let resp: { [key: string]: any };
    if (isFireFox()) {
      resp = await browser.storage.local.get([this.key]);
    } else {
      resp = await new Promise(
        resolve => chrome.storage.local.get([this.key], resp => resolve(resp)));
    }
    return JSON.parse(resp[this.key] || 'null');
  }
}

export const optionsStore = new Store<Options>('options');
export const tabsStore = new Store<TabGroup[]>('tabGroups');
