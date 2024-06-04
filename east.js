import wixSite from 'wix-site'
import wixLocation from 'wix-location'

import { Campuses } from 'public/types'
import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'

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
    campuses: [Campuses.East]
  })
  const specialEventsQuery = await getSpecialEvents({
    date: new Date(),
    campuses: [Campuses.East]
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

  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  // Staff emails
  $w('#repeater5Staff').onItemReady(($item, itemData, index) => {
    $item('#button5Contact').link =
      'mailto:' + itemData.staffEmail + '?subject=East Campus'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#button5Contact').show()
    } else {
      $item('#button5Contact').hide()
    }
  })
})
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
