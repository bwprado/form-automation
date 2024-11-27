import wixData from 'wix-data'
import { getCurrentSeasonInfo } from 'public/dynamic-button/index'

$w.onReady(async () => {
  const currentSeason = await getCurrentSeasonInfo(new Date())

  $w('#btnClasses').label = currentSeason?.label
    ? `${currentSeason.label} (East)`
    : 'Current Classes (East)'
  $w('#btnClasses').link = currentSeason?.href || '#'

  populateLocation()

  $w('#dropdownCampus, #dropdownDay').onChange(() => {
    search()
  })

  $w('#datasetLearning')
    .setFilter(wixData.filter().ne('isHidden', true))
    .then(count2)

  $w('#resetBtn').onClick(() => {
    $w('#loading').show()
    $w('#datasetLearning')
      .setFilter(wixData.filter().ne('isHidden', true))
      .then(count2)
    $w('#dropdownDay, #dropdownCampus').selectedIndex = undefined
  })

  $w('#repeater1').onItemReady(($w, itemData, index) => {
    let buttonUrl = itemData.actionButtonUrl
    let buttonLabel = itemData.actionButtonLabel
    $w('#buttonAction').link = buttonUrl

    itemData.actionButtonUrl
      ? $w('#buttonAction').expand()
      : $w('#buttonAction').collapse()

    // action button label defaults to Register, but can be overwriiten in the Collection
    itemData.actionButtonLabel
      ? ($w('#buttonAction').label = buttonLabel)
      : ($w('#buttonAction').label = 'Register')
  })
})

function populateLocation() {
  wixData
    .query('LearningCommunity')
    .ne('isHidden', true)
    .limit(1000)
    .ascending('day')
    .distinct('day')
    .then((results) => {
      let distinctList = buildOptions2(results.items)
      // Add "All" to the existing list
      distinctList.unshift({ value: 'All', label: 'All' })
      // build the unique elemnt list
      $w('#dropdownDay').options = distinctList
    })
}

function buildOptions2(items) {
  return items.map((curr) => {
    // Use the map method to build the options list in the format {label:uniqueTitle, value:uniqueTitle}
    return { label: curr, value: curr }
  })
}

function count() {
  $w('#datasetLearning').onReady(() => {
    let total = $w('#datasetLearning').getTotalCount()

    if (total > 1) {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText, #resetBtn').show()
    } else if (total === 1) {
      $w('#totalResultsText').text = `${total} result found`
      $w('#totalResultsText, #resetBtn').show()
    } else {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText, #resetBtn').show()
    }

    $w('#loading').hide()
  })
}

function count2() {
  $w('#datasetLearning').onReady(() => {
    let total = $w('#datasetLearning').getTotalCount()

    if (total > 1) {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText').show()
    } else if (total === 1) {
      $w('#totalResultsText').text = `${total} result found`
      $w('#totalResultsText').show()
    } else {
      $w('#totalResultsText').text = `${total} results found`
      $w('#totalResultsText').show()
    }

    $w('#loading').hide()
    $w('#resetBtn').hide()
  })
}

function search() {
  $w('#loading').show()
  let filter = wixData.filter().ne('isHidden', true)
  let campus = $w('#dropdownCampus').value
  let day = $w('#dropdownDay').value

  if (campus && campus !== '') {
    filter = filter.hasSome('campus', campus)
  }
  if (day && day !== 'All') {
    filter = filter.eq('day', day) //town is my field key
  }

  $w('#datasetLearning').setFilter(filter).then(count)

  console.log(filter)
}
