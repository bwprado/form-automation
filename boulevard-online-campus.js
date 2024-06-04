// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixLocation from 'wix-location'
import wixSite from 'wix-site'

import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { Campuses } from 'public/types'

/**
 * @typedef {import('public/types').Event} Event
 */

/**
 * @function prepareRepeaterEvents
 * @param {any} $item
 * @param {Event} itemData
 */
async function prepareRepeaterEvents($item, itemData) {
  $item('#buttonEvent').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape
  $item('#textEventName').text = itemData.eventTitle
  $item('#textDate').text = itemData?.eventEndDate
    ? format(itemData.eventEndDate, 'MMM d, yyyy')
    : '-'
  $item('#textTime').text = itemData?.eventEndDate
    ? format(itemData.eventEndDate, 'h:mm a')
    : '-'
}

$w.onReady(async function () {
  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)

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

  $w('#repeaterEvents').data = allEvents

  $w('#sectionEvents')[allEvents.length ? 'expand' : 'collapse']()
  $w('#noResText')[allEvents.length ? 'hide' : 'show']()

  wixSite.prefetchPageResources({
    pages: ['/boulevard-kids-east', '/campus-west-murfreesboro', '/new-home']
  })

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
