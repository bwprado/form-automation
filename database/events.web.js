import wixData from 'wix-data'

import { Permissions, webMethod } from 'wix-web-module'

/**
 * @typedef {Object} Event
 * @property {string} _id
 * @property {'hidden' | 'visible'} status
 * @property {string} eventTitle
 * @property {string} eventDescription
 * @property {string} eventStartDate
 * @property {string} eventEndDate
 * @property {string} eventImageLandscape
 * @property {string} eventLocationName
 * @property {string} redirectUrl
 * @property {string[]} serviceOpportunities
 * @property {string[]} eventMinistries
 * @property {string} eventAssociatedCampuses
 * @property {string} eventVideo
 * @property {string} richDescription
 * @property {string} eventRegistrationUrl
 * @property {string} buttonALabel
 * @property {boolean} ministrySpecificEvent
 * @property {boolean} isSpecial
 * @property {string} link-events-eventTitle
 */

/**
 * @function getEventsFromToday
 * @description Get events from today
 * @params {Object} options - options
 * @params {Date | null} options.start - start date
 * @params {Date | null} options.end - end date
 * @returns {Promise<Array<Event>>}
 */
async function getAllEventsFunction({ start = null, end = null }) {
  try {
    let eventsQuery = await wixData
      .query('Events')
      .limit(20)
      .eq('eventOnHomepage', true)
      .ne('ministrySpecificEvent', true)
      .ne('eventIsHidden', true)
      .ascending('eventEndDate')

    end && eventsQuery.ge('eventEndDate', end)

    const { items: events } = await eventsQuery.find()

    let specialEventsQuery = await wixData
      .query('SpecialEvent')
      .limit(20)
      .ne('hideEvents', true)

    const { items: specialEvents } = await specialEventsQuery.find()

    return [...parseSpecialEvent(specialEvents), ...events]
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getAllEvents = webMethod(Permissions.Anyone, getAllEventsFunction)

function parseSpecialEvent(specialEvents) {
  return specialEvents.map((specialEvent) => ({
    _id: specialEvent._id,
    eventTitle: specialEvent.title,
    eventDescription: specialEvent.eventDescriptionTitle,
    eventImageLandscape: specialEvent.scheduleBackgroundImage,
    eventStartDate: specialEvent?.startDate || null,
    eventEndDate: specialEvent?.endDate || null,
    ['link-events-eventTitle']: specialEvent['link-special-event-title']
  }))
}
