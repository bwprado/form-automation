import wixData from 'wix-data'

import { observable } from 'mobx'

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

    return this.campusFilter ? this.campusFilter.and(keysFilter) : keysFilter
  }
})
