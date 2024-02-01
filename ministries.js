import { debounce } from 'lodash'
import { autorun } from 'mobx'
import { filterState } from 'public/states/ministries'
import wixData from 'wix-data'

/**
 * @author Christopher Derrell
 * This function provides a local copy of the ministries Database that includes the service Opportunities fields.
 * This way we can count the number of service opportunities in the item onready, as well as update as necessary.
 * It uses the very quick and powerful memory module from wix-storage.
 * @returns Promise<boolean>
 */
let serviceOpportunitiesById = {}

$w.onReady(async function () {
  filterState.setInitialFilter(wixData.filter().ne('hideMinistry', true))

  $w('#repeater1').onItemReady(prepareRepeater)

  await $w('#datasetMinistries').onReadyAsync()

  await $w('#datasetMinistries').setFilter(filterState.getFilter())
  newCount()

  $w('#iptSearch').onInput(debouncedSearchInput)
  $w('#btnClearSearch').onClick(handleClearSearch)
  $w('#ddCampus').onChange(handleCampusChange)

  autorun(() => {
    updateMinistries()
  })
})

async function prepareRepeater($item, itemData) {
  let opportunities = serviceOpportunitiesById[itemData?._id]
  let redirectUrl = itemData.ministryUrl

  //TODO, conect that value to the UI
  $item('#buttonOpportunities').label = `${opportunities} opportunit${
    opportunities > 1 ? 'ies' : 'y'
  }`

  $item('#buttonOpportunities')[opportunities > 0 ? 'show' : 'hide']()

  $item('#bannerCampus')[itemData?.ministryCampus ? 'show' : 'hide']()

  // redirect if ministryUrl exists
  if (redirectUrl) {
    $item('#buttonMoreInfo').link = redirectUrl
    $item('#buttonMoreInfo').target = '_self'
  } else {
    $item('#buttonMoreInfo').link
  }

  $item('#imageMinistry').src =
    itemData?.ministryLogo ||
    'https://static.wixstatic.com/media/77e3c1_a3767b60e1624ea2a70c82f3c816a9f0~mv2.png'

  $item('#textMinistryDescription').text =
    itemData?.ministryDescriptionText?.length > 82
      ? itemData?.ministryDescriptionText.substr(0, 82) + '...'
      : itemData?.ministryDescriptionText || ''
}

/**
 * This function counts the number of results found and displays it on the page
 * It is called when the dataset is ready and when the search is complete
 * It also hides the loading spinner when it is complete
 * @author {Bruno Prado} by Threed Software
 * @function newCount
 */
async function newCount() {
  await $w('#datasetMinistries').onReadyAsync()
  let total = $w('#datasetMinistries')?.getTotalCount() || 0

  $w('#txtSearchResults').text = `${total} result${
    total > 1 || total === 0 ? 's' : ''
  } found`
  $w('#txtSearchResults').show()
}

/**
 * This function searches the ministries database for the search term
 * It searches the title, description, description text, and campus fields
 * It uses an array of split search terms to search for each word in the search term
 * It uses a debounce to prevent multiple calls to the database
 * @author {Bruno Prado} by Threed Software
 * @function searchMinistries
 * @param {any} e
 */
async function searchMinistries(e) {
  const search = e?.target?.value || ''

  $w('#btnClearSearch')[!search?.length ? 'hide' : 'show']()

  filterState.setSearch(e.target.value)
}

/**
 * This function clears the search bar and resets the dataset filter
 * It also hides the clear search button
 * @author {Bruno Prado} by Threed Software
 * @function handleClearSearch
 */
async function handleClearSearch() {
  $w('#iptSearch').value = ''
  await searchMinistries({ target: { value: '' } })
}

/**
 * This function updates the campus filter and then updates the dataset filter
 * @author {Bruno Prado} by Threed Software
 * @function handleCampusChange
 * @param {$w.Event} e
 */
async function handleCampusChange(e) {
  filterState.setCampusFilter(e.target.value)
}

/**
 * This function is called to update the filtered dataset
 * It is called when the search term changes or the campus filter changes
 * @author {Bruno Prado} by Threed Software
 * @function updateMinistries
 */
async function updateMinistries() {
  $w('#searchLoading').show()

  await $w('#datasetMinistries').setFilter(filterState.getFilter())
  await newCount()

  $w('#searchLoading').hide()
}

/**
 * @function debouncedUpdateMinistries
 * @description This function is a debounced version of updateMinistries
 */
const debouncedSearchInput = debounce((e) => searchMinistries(e), 500)
