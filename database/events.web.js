import wixData from 'wix-data'

import { Permissions, webMethod } from 'wix-web-module'
import { uniqBy } from 'lodash'
import { format, parseISO } from 'date-fns'

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
 * @param {Date} options.start - start date
 * @param {Date} options.end - end date
 * @param {boolean} options.onHomePage - on home page
 * @param {boolean} options.isHidden - is hidden
 * @param {boolean} options.ministrySpecific - ministry specific
 * @param {Campuses[]} options.campuses - campuses
 * @returns {Promise<Event[] | []>}
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
      .ascending('eventEndDate')

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

    const { items: events } = await eventsQuery.find()
    return events
  } catch (error) {
    console.error(error)
    return []
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
    eventImageLandscape: specialEvent.scheduleBackgroundImage,
    date: specialEvent?.date || null,
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
 * @param {Object} options
 * @param {Date} options.date
 * @returns {Promise<SpecialEvent[]>}
 */
async function getSpecialEventsFunction({ date }) {
  try {
    let specialEventsQuery = await wixData
      .query('SpecialEvent')
      .ge('date', date)
      .limit(20)

    const { items: specialEvents } = await specialEventsQuery.find()
    console.log(specialEvents)
    return specialEvents
  } catch (error) {
    console.error(error)
    return []
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
    date: format(parseISO(special?.date), 'MMM, dd yyyy') || null,
    ['link-events-eventTitle']:
      special.referencedSpecialEvent['link-special-event-title'],
    isSpecial: true
  }))
}
