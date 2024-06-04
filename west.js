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
    campuses: [Campuses.West]
  })
  const specialEventsQuery = await getSpecialEvents({
    date: new Date(),
    campuses: [Campuses.West]
  })

  const allEvents = [
    ...eventsQuery.items,
    ...parseSpecialEvents(specialEventsQuery.items)
  ].sort((a, b) => a.eventEndDate - b.eventEndDate)

  $w('#repeaterEvents').data = allEvents

  $w('#sectionEvents')[allEvents.length ? 'expand' : 'collapse']()
  $w('#noResText')[allEvents.length ? 'hide' : 'show']()

  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ['/boulevard-kids-west', '/nbyg-west']
  })

  if (response.errors) {
    // handle errors
  }

  // Dropdown Navigation
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  // RESOURCES color control
  $w('#repeaterResource').onItemReady(adjustResourceItem)

  // Staff Contact Emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=West Campus'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })
})

// Used to adjust the colors of the resource Type tiles in the repeater
function adjustResourceItem($item, itemData, index) {
  if (itemData.resourceColor) {
    $item('#itemResource').style.backgroundColor = itemData.resourceColor
  } else {
    $item('#itemResource').style.backgroundColor = '#36424a'
  }
}

// What to Expect
export function buttonWorship_click(event) {
  $w('#buttonWorship').disable()
  $w('#buttonChildren').enable()
  $w('#buttonYouth').enable()
  $w('#buttonAdults').enable()
  $w('#multiStateWhat').changeState('stateA')
}

export function buttonChildren_click(event) {
  $w('#buttonWorship').enable()
  $w('#buttonChildren').disable()
  $w('#buttonYouth').enable()
  $w('#buttonAdults').enable()
  $w('#multiStateWhat').changeState('stateB')
}

export function buttonYouth_click(event) {
  $w('#buttonWorship').enable()
  $w('#buttonChildren').enable()
  $w('#buttonYouth').disable()
  $w('#buttonAdults').enable()
  $w('#multiStateWhat').changeState('stateC')
}

export function buttonAdults_click(event) {
  $w('#buttonWorship').enable()
  $w('#buttonChildren').enable()
  $w('#buttonYouth').enable()
  $w('#buttonAdults').disable()
  $w('#multiStateWhat').changeState('stateD')
}
