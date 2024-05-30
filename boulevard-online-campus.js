// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixLocation from 'wix-location'
import wixSite from 'wix-site'
import wixData from 'wix-data'

import { Campuses } from 'public/types/campuses'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'

$w.onReady(async function () {
  const eventsQuery = await getEvents({
    start: new Date(),
    campuses: [Campuses.Online]
  })
  const specialEventsQuery = await getSpecialEvents({
    date: new Date(),
    campuses: [Campuses.Online]
  })

  const allEvents = [
    ...eventsQuery.items,
    ...parseSpecialEvents(specialEventsQuery.items)
  ].sort((a, b) => a.eventEndDate - b.eventEndDate)

  console.log(allEvents)
  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ['/boulevard-kids-east', '/campus-west-murfreesboro', '/new-home']
  })

  if (response.errors) {
    // handle errors
  }

  // Dropdown Navigation
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  // Staff emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=Boulevard Online Campus'

    $item('#buttonContact')[itemData?.staffEmail ? 'show' : 'hide']()
  })

  //filter past Event Dates & Campus
  var today = new Date()
  $w('#datasetEvents')
    .setFilter(
      wixData
        .filter()
        .ge('eventStartDate', today)
        .hasSome('eventAssociatedCampuses', [Campuses.Online])
        .ne('eventIsHidden', true)
        .ne('ministrySpecificEvent', true)
    )
    .then(() => {
      // No Events Message
      errorTextResult()
    })

  // No Event Repeater Results
  function errorTextResult() {
    $w('#datasetEvents').onReady(() => {
      let count = $w('#datasetEvents').getTotalCount()

      $w('#sectionEvents')[count > 0 ? 'expand' : 'collapse']()
      $w('#noResText')[count > 0 ? 'hide' : 'show']()
    })
  }
})

// What to Expect

export function buttonWorship_click(event) {
  $w('#buttonWorship').hide()
  $w('#buttonWorshipSelected').show()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').expand()
  $w('#boxChildren').collapse()
  $w('#boxYouth').collapse()
  $w('#boxAdults').collapse()
}

export function buttonChildren_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').hide()
  $w('#buttonChildrenSelected').show()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').collapse()
  $w('#boxChildren').expand()
  $w('#boxYouth').collapse()
  $w('#boxAdults').collapse()
}

export function buttonYouth_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').hide()
  $w('#buttonYouthSelected').show()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').collapse()
  $w('#boxChildren').collapse()
  $w('#boxYouth').expand()
  $w('#boxAdults').collapse()
}

export function buttonAdults_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').hide()
  $w('#buttonAdultsSelected').show()
  $w('#boxWorship').collapse()
  $w('#boxChildren').collapse()
  $w('#boxYouth').collapse()
  $w('#boxAdults').expand()
}
