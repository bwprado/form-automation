import wixData from 'wix-data'

import { observable } from 'mobx'

export const filterState = observable({
  search: '',
  searchKeys: [],
  campusFilter: '',
  filter: wixData.filter().ne('hideMinistry', true),

  setCampusFilter(value) {
    if (value === 'all') {
      this.campusFilter = ''
      return
    }
    this.campusFilter = wixData.filter().hasSome('ministryCampus', value)
  },
  setSearch(value) {
    this.search = value

    if (!this.search) {
      this.searchKeys = []
      this.filter = this.campusFilter
        ? wixData.filter().ne('hideMinistry', true).and(this.campusFilter)
        : wixData.filter().ne('hideMinistry', true)
      return
    }

    this.searchKeys = [
      ...this.search.split(' ').map((s) => s.toLowerCase()),
      ...this.search.split(' ').map((s) => s.toUpperCase()),
      ...this.search
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    ]
    this.setSearchFilter()
  },
  setSearchFilter() {
    let filter = []

    this.searchKeys.forEach((key) => {
      filter.push(wixData.filter().contains('ministryTitle', key))
      filter.push(wixData.filter().contains('ministryDescription', key))
    })

    this.filter = filter.reduce(
      (acc, cur, i) => (i === 0 ? acc.and(cur) : acc.or(cur)),
      this.filter
    )
    this.filter = this.campusFilter
      ? this.filter.and(this.campusFilter)
      : this.filter
  }
})
