import wixLocation from 'wix-location'
import wixSite from 'wix-site'

import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { Ministries } from 'public/types'

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
    ministries: [Ministries.nybgEast]
  })
  const specialEventsQuery = await getSpecialEvents({
    date: new Date()
  })

  const allEvents = [
    ...eventsQuery.items,
    ...parseSpecialEvents(specialEventsQuery.items)
  ].sort((a, b) => a.eventEndDate - b.eventEndDate)

  $w('#repeaterEvents').data = allEvents

  $w('#sectionEvents')[allEvents.length ? 'expand' : 'collapse']()
  $w('#noResText')[allEvents.length ? 'hide' : 'show']()

  wixSite.prefetchPageResources({
    pages: ['/nbyg-west']
  })

  // Staff Emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=nbyg'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })

  // Campus Dropdown
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })
})
