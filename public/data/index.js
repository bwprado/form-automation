import wixData from 'wix-data'

import { WixDataQueryResult } from 'wix-data'

const WixDataQueryResultEmpty = {
  currentPage: 0,
  items: []
}

/**
 * @typedef {import('public/types/events').Event} Event
 * @typedef {import('public/types/events').Campuses} Campuses
 * @typedef {import('public/types/events').SpecialEvent} SpecialEvent
 * @typedef {import('public/types/events').ParsedSpecialEvent} ParsedSpecialEvent
 * @typedef {import('public/types/events').SpecialEventSchedule} SpecialEventSchedule
 */

/**
 * @function getEventsPublic
 * @description Get events from today
 * @param {Object} options - options
 * @param {Date} [options.start] - start date
 * @param {Date} [options.end] - end date
 * @param {boolean} [options.onHomePage] - on home page
 * @param {boolean} [options.isHidden] - is hidden
 * @param {boolean} [options.ministrySpecific] - ministry specific
 * @param {Campuses[]} [options.campuses] - campuses
 * @returns {Promise<Partial<WixDataQueryResult>>}
 */
export async function getEvents({
  start = null,
  end = null,
  onHomePage = false,
  isHidden = false,
  ministrySpecific = false,
  campuses = []
}) {
  try {
    let eventsQuery = await wixData.query('Events').limit(20)

    eventsQuery = isHidden
      ? eventsQuery.eq('eventIsHidden', isHidden)
      : eventsQuery
    eventsQuery = ministrySpecific
      ? eventsQuery.eq('ministrySpecificEvent', ministrySpecific)
      : eventsQuery
    eventsQuery =
      campuses.length > 0
        ? eventsQuery.hasSome('eventAssociatedCampuses', campuses)
        : eventsQuery
    eventsQuery = onHomePage
      ? eventsQuery.eq('eventOnHomepage', onHomePage)
      : eventsQuery
    eventsQuery = start ? eventsQuery.ge('eventStartDate', start) : eventsQuery
    eventsQuery = end ? eventsQuery.ge('eventEndDate', end) : eventsQuery

    return await eventsQuery.find()
  } catch (error) {
    console.error(error)
    return WixDataQueryResultEmpty
  }
}

/**
 * @function getSpecialEvents
 * @description Get special events
 * @param {Object} params
 * @param {Date} [params.date]
 * @param {Campuses[]} [params.campuses]
 * @param {boolean} [params.hideEvents]
 * @returns {Promise<Partial<WixDataQueryResult>>}
 */
export async function getSpecialEvents({ date, campuses = [], hideEvents }) {
  try {
    let specialEventsQuery = await wixData
      .query('SpecialEvent')
      .ge('date', date)
      .ascending('date')
      .limit(20)

    specialEventsQuery =
      campuses.length > 0
        ? specialEventsQuery.hasSome('eventAssociatedCampuses', campuses)
        : specialEventsQuery

    specialEventsQuery = hideEvents
      ? specialEventsQuery.eq('hideEvents', hideEvents)
      : specialEventsQuery

    return await specialEventsQuery.find()
  } catch (error) {
    console.error(error)
    return WixDataQueryResultEmpty
  }
}

/**
 * @function parseSpecialEvents
 * @description Parse special events to Events
 * @param {SpecialEvent[]} specialEvents
 * @returns {ParsedSpecialEvent[]}
 */
export function parseSpecialEvents(specialEvents) {
  return specialEvents.map((specialEvent) => ({
    _id: specialEvent._id,
    eventTitle: specialEvent.title,
    eventDescription: specialEvent.eventDescription,
    eventImageLandscape: specialEvent.image,
    eventStartDate: specialEvent.date,
    eventEndDate: specialEvent.date,
    ['link-events-eventTitle']: specialEvent['link-special-event-title'],
    isSpecial: true
  }))
}
