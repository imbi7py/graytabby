export interface TabSummary {
  pinned: boolean,
  windowId: number,
  id: number,
  url: string,
  title: string,
  key?: string
}

export interface TabGroup {
  tabs: TabSummary[],
  date: number,
  key: string
}

export interface Options {
  fontSize: number
}
