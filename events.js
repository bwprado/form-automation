import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'
import { format } from 'date-fns'
import { observable, autorun } from 'mobx'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'

const eventsState = observable({
  allEvents: [],
  eventsQuery: {},
  specialEventsQuery: {},
  get sortedAllEvents() {
    if (!this.allEvents.length) return []
    return this.allEvents.toSorted(
      (a, b) => a.eventStartDate - b.eventStartDate
    )
  },
  setAllEvents(events) {
    this.allEvents = events
  },
  setEventsQuery(query) {
    this.eventsQuery = query
  },
  setSpecialEventsQuery(query) {
    this.specialEventsQuery = query
  }
})

/**
 * @typedef {import('public/types').Event} Event
 * @typedef {import('public/types').ParsedSpecialEvent} ParsedSpecialEvent
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
 * @function prepareRepeaterEvents
 * @description Prepare the events repeater
 * @param {any} $item
 * @param {Partial<Event>} itemData
 */
const prepareRepeaterEvents = async ($item, itemData) => {
  $item('#textEventTitle').text = itemData.eventTitle
  $item('#textDate').text = format(itemData.eventStartDate, 'MMM d, yyyy')
  $item('#textTime').text = itemData?.eventStartDate
    ? format(itemData.eventStartDate, 'h:mm a')
    : ''
  $item('#textLocation').text = itemData.eventLocationName
  $item('#buttonRegister').link = itemData?.eventRegistrationUrl || ''
  $item('#buttonMoreInfo').link = itemData['link-events-eventTitle']
  $item('#buttonEventInfo').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape

  $item('#buttonRegister')[
    itemData?.eventRegistrationUrl ? 'expand' : 'collapse'
  ]()

  let campuses = itemData?._id
    ? await getMultiReferencePropertyFromCollection(
        itemData?.isSpecial ? 'campuses' : 'eventAssociatedCampuses',
        itemData?.isSpecial ? 'SpecialEvent' : 'Events',
        itemData._id
      )
    : []

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
}

const handleLoadMoreButton = async () => {
  if (eventsState.eventsQuery.hasNext()) {
    const nextEvents = await eventsState.eventsQuery.next()
    eventsState.setEventsQuery(nextEvents)
    eventsState.setAllEvents([...eventsState.allEvents, ...nextEvents.items])
  }
  if (eventsState.specialEventsQuery.hasNext()) {
    const nextSpecialEvents = await eventsState.specialEventsQuery.next()
    eventsState.setSpecialEventsQuery(nextSpecialEvents)
    const parsedNextSpecialEvents = parseSpecialEvents(nextSpecialEvents.items)
    eventsState.setAllEvents([
      ...eventsState.allEvents,
      ...parsedNextSpecialEvents
    ])
  }
}

$w.onReady(async () => {
  eventsState.setSpecialEventsQuery(
    await getSpecialEvents({ date: new Date() })
  )
  eventsState.setEventsQuery(await getEvents({ start: new Date() }))

  const parsedSpecialEvents = parseSpecialEvents(
    eventsState.specialEventsQuery.items
  )
  eventsState.setAllEvents([
    ...eventsState.eventsQuery.items,
    ...parsedSpecialEvents
  ])

  $w('#repeaterSpecial').onItemReady(prepareRepeaterSpecial)
  $w('#repeaterSpecial').data = eventsState.specialEventsQuery.items

  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)

  autorun(() => {
    $w('#repeaterEvents').data = eventsState.sortedAllEvents
    $w('#loadMoreButton')[eventsState.eventsQuery.hasNext() ? 'show' : 'hide']()
  })

  $w('#loadMoreButton').onClick(handleLoadMoreButton)
})
