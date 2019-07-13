import {Options, TabGroup} from "../@types/graytabby";

class Store<PayloadT> {
  protected key: string;
  public approxSize: number;

  constructor(key: string) {
    this.key = key;
  }

  public put(value: PayloadT): void {
    let strVal = JSON.stringify(value);
    this.approxSize = strVal.length;
    localStorage.setItem(this.key, strVal);
  }

  public get(): PayloadT | null {
    return JSON.parse(localStorage.getItem(this.key) || 'null');
  }
}

export const optionsStore = new Store<Options>('options');
export const tabsStore = new Store<TabGroup[]>('tabGroups');
