import wixSite from 'wix-site'

import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'
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
}

$w.onReady(async function () {
  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)

  const eventsQuery = await getEvents({
    start: new Date(),
    ministries: [Ministries.BoulevardKidsEast, Ministries.BoulevardKidsWest]
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
    pages: [
      '/boulevard-kids-east',
      '/boulevard-kids-online',
      '/boulevard-kids-west',
      '/sonshine-school'
    ]
  })
})
