export interface TabSummary {
  pinned: boolean,
  windowId: number,
  id: number,
  url: string,
  title: string,
  displayKey?: string
}

export interface TabGroup {
  tabs: TabSummary[],
  title: string,
  date: Date
}

export interface Options {
  fontSize: number
}

export interface GlobalState {
  options: Options,
  view: string
}
