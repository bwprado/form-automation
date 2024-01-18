import wixData from 'wix-data'

import { observable } from 'mobx'

const FILTER_VALUES = {
  all: 'all',
  east: '9cf1b820-8a76-436d-b61c-c26346e98da5',
  west: 'ede394da-93a1-4b61-b59f-c81453e557d1',
  online: '0f966792-1688-49a0-8fd0-697c9d342375',
  allCampuses: '4a4b706f-3a88-43a1-8f0a-406e108c4d81'
}

export const filterState = observable({
  search: '',
  searchKeys: [],
  campusFilter: null,
  filter: null,
  initialFilter: null,

  setInitialFilter(filter) {
    this.initialFilter = filter
  },
  setCampusFilter(value) {
    if (value === 'all') {
      this.campusFilter = null
      return
    }
    this.campusFilter = wixData.filter().hasSome('ministryCampus', value)
  },
  setSearch(value) {
    this.search = value

    if (!this.search) {
      this.searchKeys = []
      return
    }

    this.searchKeys = [
      ...this.search.split(' ').map((s) => s.toLowerCase()),
      ...this.search.split(' ').map((s) => s.toUpperCase()),
      ...this.search
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    ]
  },
  getFilter() {
    let searchFilter = []

    if (this.searchKeys.length === 0) {
      searchFilter = [this.initialFilter]
    } else {
      this.searchKeys.forEach((key) => {
        searchFilter.push(wixData.filter().contains('ministryTitle', key))
        searchFilter.push(wixData.filter().contains('ministryDescription', key))
      })
    }

    let keysFilter =
      searchFilter.length > 1
        ? this.initialFilter.and(searchFilter.reduce((a, b) => a.or(b)))
        : searchFilter[0]

    return this.campusFilter
      ? this.campusFilter
          .and(keysFilter)
          .or(wixData.filter().hasSome('ministryCampus', FILTER_VALUES.allCampuses))
      : keysFilter
  }
})
