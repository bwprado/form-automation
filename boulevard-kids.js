import wixData from 'wix-data'
import wixSite from 'wix-site'
//import {collapseElementsInRepeater, setElementOpacity, setColorsFullAlpha} from 'public/utils.js'
import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'

// Our main onReady event handler we will use asynch as the mode of use so that
// we can simplify the use of promise based functions.
$w.onReady(async () => {
  // Configure handlers
  // Only create handler once in the onReady scope

  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: [
      '/boulevard-kids-east',
      '/boulevard-kids-online',
      '/boulevard-kids-west',
      '/sonshine-school'
    ]
  })

  if (response.errors) {
    // handle errors
  }

  // filter past Event Dates & Campus
  var today = new Date()

  // Use await instead of promise construct as it is easier to work with.
  await $w('#datasetEvents').setFilter(
    wixData
      .filter()
      .ge('eventStartDate', today)
      //.eq('ministrySpecificEvent', true)
      .hasSome('eventMinistries', [
        'b594a941-1bd9-45b6-859d-9fb59eba3433',
        '04b632be-e422-4648-afca-be5c2a468b0f'
      ])
      .ne('eventIsHidden', true)
  )

  checkEventFilterResult()

  $w('#repeaterEvents').onItemReady(async ($item, itemData, index) => {
    let campuses = itemData
      ? await getMultiReferencePropertyFromCollection(
          'eventAssociatedCampuses',
          'Events',
          itemData._id
        )
      : []
    console.log(
      `campuses [${campuses.length}] event: [${
        itemData.eventTitle
      }] color ${JSON.stringify($item('#tagCampus').style)}`
    )

    if (campuses.length === 1) {
      $item('#tagCampus').label = campuses[0].campusFullTitle
      $item('#tagCampus')
        .expand()
        .catch((error) => console.log(`Show Error: ${error.message}`))
    } else {
      $item('#tagCampus').label = ''
      $item('#tagCampus')
        .collapse()
        .catch((error) => console.log(`Hide Error: ${error.message}`))
    }
  })

  // Checks to see if the Events Repeater filter generated Results
  // Called after repeater filter has been triggered.
  function checkEventFilterResult() {
    let count = $w('#datasetEvents').getTotalCount()

    if (count > 0) {
      $w('#sectionEvents').expand()
      $w('#noResText').hide()
    } else {
      $w('#sectionEvents').collapse()
      $w('#noResText').show()
    }
  }
})
