import wixData from 'wix-data'
import { memory } from 'wix-storage'
import { getAllData } from 'public/dataUtilities.js'

/**
 * @author Christopher Derrell
 * This function provides a local copy of the ministries Database that includes the service Opportunities fields.
 * This way we can count the number of service opportunities in the item onready, as well as update as necessary.
 * It uses the very quick and powerful memory module from wix-storage.
 * @returns Promise<boolean>
 */
let serviceOpportunitiesById = {}

async function cacheServiceOpportunities() {
  const items = await getAllData('Ministries')

  //console.log(items);

  //Store just the item IDs and service opportunities in cache.
  items.forEach((item) => {
    serviceOpportunitiesById[item._id] = item.serviceOpportunities.length
  })
}
$w.onReady(async function () {
  // console.log('page ready')
  await cacheServiceOpportunities()
  $w('#datasetMinistries').onReady(() => {
    // console.log('dataset ready')

    $w('#repeater1').onItemReady(async ($item, itemData, index) => {
      // $w("#buttonOpportunities").label = `${} Opportunities`
      let opportunities = serviceOpportunitiesById[itemData._id]
      console.log('Total Opportunities: ' + opportunities)

      //TODO, conect that value to the UI
      $item('#buttonOpportunities').hide() //default is hide the button.
      if (opportunities > 0) {
        $item('#buttonOpportunities').label = `${
          opportunities > 1
            ? opportunities + ' opportunities'
            : opportunities + ' opportunity'
        }`
        $item('#buttonOpportunities').show()
      }

      let image = itemData.ministryLogo
      let campusBanner = itemData.ministryCampus
      let theItem = itemData.ministryDescriptionText
      let ministryUrl = itemData.ministryUrl

      if (image) {
        $item('#imageMinistry').src = image
      } else {
        $item('#imageMinistry').src =
          'https://static.wixstatic.com/media/77e3c1_a3767b60e1624ea2a70c82f3c816a9f0~mv2.png'
      }

      if (campusBanner) {
        $item('#bannerCampus').show()
      } else {
        $item('#bannerCampus').hide()
      }

      if (theItem) {
        var shortDescription = theItem.substr(0, 82)
        $item('#textMinistryDescription').text = shortDescription + '...'
      }

      if (ministryUrl) {
        $item('#buttonMoreInfo').link = ministryUrl
      } else {
        $item('#buttonMoreInfo').link
      }
    })
  })

  // filters, reset button, repeater image
  buildCampus()
  filterTypeDropdown()

  $w('#datasetMinistries')
    .setFilter(wixData.filter().ne('hideMinistry', true))
    .then(count2)
  /*
    $w("#repeater1").onItemReady(($item, itemData, index) => {
       $item("#buttonContact").link = "mailto:" + itemData.lifeGroupContact + "?subject=LIFE group";
    });
    */

  $w('#resetBtn').onClick(() => {
    $w('#loading').show()
    $w('#datasetMinistries')
      .setFilter(wixData.filter().ne('hideMinistry', true))
      .then(count2)
    $w('#dropdownType').selectedIndex = undefined
  })
})

// return [{label:"Provider", value:"_id of that campus"}]
async function buildCampus() {
  // get non-duplicate provider id from the database
  let resCampus = await wixData
    .query('Ministries')
    .ne('hideMinistry', true)
    .limit(999)
    .distinct('ministryType')
  // console.log({ resCampus });

  let res = await wixData
    .query('MinistryTypes')
    .hasSome('_id', resCampus.items)
    .limit(999)
    .ascending('title')
    .find()
  // console.log({ res })
  let options = [
    {
      label: 'All',
      value: 'all'
    },
    ...res.items.map((el) => ({ label: el.title, value: el._id }))
  ]
  // console.log({ options })

  $w('#dropdownType').options = options
}

function filterTypeDropdown() {
  $w('#dropdownType').onChange(() => {
    $w('#loading').show()

    // console.log($w("#dropdownType").value)

    if ($w('#dropdownType').value === 'all') {
      $w('#datasetMinistries')
        .setFilter(wixData.filter().ne('hideMinistry', true))
        .then(count)
    } else {
      $w('#datasetMinistries')
        .setFilter(
          wixData
            .filter()
            .hasSome('ministryType', $w('#dropdownType').value)
            .ne('hideMinistry', true)
        )
        .then(count)
    }
  })
}

function count() {
  $w('#datasetMinistries').onReady(() => {
    let total = $w('#datasetMinistries').getTotalCount()

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
  $w('#datasetMinistries').onReady(() => {
    let total = $w('#datasetMinistries').getTotalCount()

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
