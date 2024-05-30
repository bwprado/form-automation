import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'
import { getSpecialEvents } from 'backend/database/events.web'
import { format } from 'date-fns'

/**
 * @typedef {import('public/types/events').Event} Event
 * @typedef {import('public/types/events').ParsedSpecialEvent} ParsedSpecialEvent
 */

/**
 * @function prepareRepeaterSpecial
 * @description Prepare the special event repeater
 * @param {any} $item
 * @param {ParsedSpecialEvent} itemData
 */
const prepareRepeaterSpecial = async ($item, itemData) => {
  $item('#textEventName').text = itemData.eventTitle
  $item('#image').src = itemData.eventImageLandscape
  $item('#buttonEvent').link = itemData['link-events-eventTitle']
}

/**
 *
 * @param {any} $item
 * @param {Event} itemData
 */
const prepareRepeaterEvents = async ($item, itemData) => {
  $item('#textEventTitle').text = itemData.eventTitle
  $item('#textDate').text = format(itemData.eventStartDate, 'MMM d, yyyy')
  $item('#textTime').text = format(itemData.eventStartDate, 'h:mm a')
  $item('#textLocation').text = itemData.eventLocationName
  $item('#buttonRegister').link = itemData.eventRegistrationUrl
  $item('#buttonMoreInfo').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape

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

  debugger

  if (campuses.length === 1) {
    $item('#tagCampus').label = campuses[0].campusFullTitle
    $item('#tagCampus')
      .expand()
      .catch((error) => console.log(`Show Error: ${error.message}`))
  } else if (campuses.length > 1) {
    $item('#tagCampus').label = 'All Campuses'
    $item('#tagCampus')
      .expand()
      .catch((error) => console.log(`Show Error: ${error.message}`))
  } else {
    $item('#tagCampus').label = ''
    $item('#tagCampus')
      .collapse()
      .catch((error) => console.log(`Hide Error: ${error.message}`))
  }

  $item('#textTime')[itemData.isSpecial ? 'hide' : 'show']()
  $item('#textDate')[itemData.isSpecial ? 'hide' : 'show']()
  $item('#textLocation')[itemData.isSpecial ? 'hide' : 'show']()
}

$w.onReady(async () => {
  const specialEvents = await getSpecialEvents({ date: new Date() })
  $w('#repeaterSpecial').onItemReady(prepareRepeaterSpecial)
  $w('#repeaterSpecial').data = specialEvents
  // $w('#sectionSpecial')[specialEvents.length ? 'expand' : 'collapse']()

  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)
})
