import wixData from 'wix-data'

import { uniqBy } from 'lodash'
import { WixDataQueryResult } from 'wix-data'
import { Permissions, webMethod } from 'wix-web-module'

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
 * @function getEventsFromToday
 * @description Get events from today
 * @param {Object} options - options
 * @param {Date} [options.start] - start date
 * @param {Date} [options.end] - end date
 * @param {boolean} [options.onHomePage] - on home page
 * @param {boolean} [options.isHidden] - is hidden
 * @param {boolean} [options.ministrySpecific] - ministry specific
 * @param {Campuses[]} [options.campuses] - campuses
 * @returns {Promise<WixDataQueryResult | any>}
 */
async function getEventsFunction({
  start = null,
  end = null,
  onHomePage = false,
  isHidden = false,
  ministrySpecific = false,
  campuses = []
}) {
  try {
    let eventsQuery = await wixData
      .query('Events')
      .limit(20)
      .descending('eventEndDate')

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

export const getEvents = webMethod(Permissions.Anyone, getEventsFunction)

/**
 *
 * @param {SpecialEvent[]} specialEvents
 * @returns {Promise<ParsedSpecialEvent[]>}
 */
async function parseSpecialEventFunction(specialEvents) {
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

export const parseSpecialEvent = webMethod(
  Permissions.Anyone,
  parseSpecialEventFunction
)

/**
 *
 * @param {Object} params
 * @param {Date} [params.date]
 * @param {Campuses[]} [params.campuses]
 * @param {boolean} [params.hideEvents]
 * @returns {Promise<WixDataQueryResult | any>}
 */
async function getSpecialEventsFunction({ date, campuses = [], hideEvents }) {
  try {
    let specialEventsQuery = await wixData
      .query('SpecialEvent')
      .ge('date', date)
      .descending('date')
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

export const getSpecialEvents = webMethod(
  Permissions.Anyone,
  getSpecialEventsFunction
)

/**
 * @function getSpecialEventScheduleFunction
 * @description Get special event schedule
 * @param {Object} params
 * @param {Date} [params.date]
 * @returns {Promise<ParsedSpecialEvent[]>}
 */
async function getSpecialEventScheduleFunction({ date }) {
  try {
    let specialEventScheduleQuery = await wixData
      .query('SpecialEventSchedules')
      .include('referencedSpecialEvent')
      .limit(20)

    specialEventScheduleQuery = date
      ? specialEventScheduleQuery.ge('date', date)
      : specialEventScheduleQuery

    const { items: specialEventSchedule } =
      await specialEventScheduleQuery.find()

    const uniqueSpecialEvents = uniqBy(
      specialEventSchedule,
      'referencedSpecialEvent._id'
    )

    const parsedSpecialEvents = parseSpecialEventSchedule(uniqueSpecialEvents)

    return parsedSpecialEvents
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getSpecialEventSchedule = webMethod(
  Permissions.Anyone,
  getSpecialEventScheduleFunction
)

/**
 * @function parseSpecialEventSchedule
 * @param {SpecialEventSchedule[]} specialEventSchedules
 * @returns {ParsedSpecialEvent[]}
 */
function parseSpecialEventSchedule(specialEventSchedules) {
  return specialEventSchedules.map((special) => ({
    _id: special._id,
    eventTitle: special.referencedSpecialEvent.title,
    eventDescription: special.scheduleDescription,
    eventImageLandscape: special?.referencedSpecialEvent?.image,
    eventEndDate: special.date,
    eventStartDate: special.date,
    ['link-events-eventTitle']:
      special.referencedSpecialEvent['link-special-event-title'],
    isSpecial: true
  }))
}

/**
 * @function getAllEventsFunction
 * @description Get all events
 * @param {Object} params
 * @param {Date} params.date
 * @param {boolean} params.onHomePage
 * @returns {Promise<{eventsQuery: WixDataQueryResult, specialEventsQuery: WixDataQueryResult} | any>}
 */
async function getAllEventsFunction({ date = new Date(), onHomePage }) {
  try {
    const eventsQuery = await getEvents({ end: date, onHomePage })
    const specialEventsQuery = await getSpecialEvents({ date })

    return { eventsQuery, specialEventsQuery }
  } catch (error) {
    console.error(error)
    return WixDataQueryResultEmpty
  }
}

export const getAllEvents = webMethod(Permissions.Anyone, getAllEventsFunction)
