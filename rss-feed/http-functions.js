import wixData from "wix-data"
import { ok, notFound, serverError, badRequest } from "wix-http-functions"
import { getYear, getMonth, getDate, getHours, getMinutes } from "date-fns"

/**
 * @author Threed Software
 * @description Returns a list of events in ICS format string from the Events collection
 * @param {$w.} request
 * @returns {Promise<String>}
 */
export async function get_eventsxml(request) {
  const ics = require("ics")
  let options = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const { query } = request

  if (query) {
    options.body = { error: "No query parameters allowed" }
    return badRequest(options)
  }

  try {
    const { items } = await wixData
      .query("Events")
      .ge("eventEndDate", new Date())
      .ne("eventIsHidden", true)
      .ascending("eventStartDate")
      .find()

    const formattedItems = items.map(
      ({
        eventTitle,
        eventDescription,
        eventStartDate,
        eventLocationAddress,
        eventRegistrationUrl
      }) => ({
        start: [
          getYear(eventStartDate),
          getMonth(eventStartDate) + 1,
          getDate(eventStartDate),
          getHours(eventStartDate),
          getMinutes(eventStartDate)
        ],
        title: eventTitle,
        description: eventDescription,
        location: eventLocationAddress,
        url: eventRegistrationUrl
      })
    )

    const { error, value } = ics.createEvents(formattedItems)
    if (error) return serverError(error)

    options.body = items.length > 0 ? { value } : { error: "No events found" }

    return items.length > 0 ? ok(options) : notFound(options)
  } catch (error) {
    return serverError(error)
  }
}

export async function getEventsxml() {
  const ics = require("ics")
  let options = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  try {
    const { items } = await wixData
      .query("Events")
      .ge("eventEndDate", new Date())
      .ne("eventIsHidden", true)
      .ascending("eventStartDate")
      .find()

    const formattedItems = items.map(
      ({
        eventTitle,
        eventDescription,
        eventStartDate,
        eventLocationAddress,
        eventRegistrationUrl
      }) => ({
        start: [
          getYear(eventStartDate),
          getMonth(eventStartDate) + 1,
          getDate(eventStartDate),
          getHours(eventStartDate),
          getMinutes(eventStartDate)
        ],
        title: eventTitle,
        description: eventDescription,
        location: eventLocationAddress,
        url: eventRegistrationUrl
      })
    )

    const { error, value } = ics.createEvents(formattedItems)
    if (error) return console.log(error)

    options.body = items.length > 0 ? { value } : { error: "No events found" }

    return items.length > 0 && value
  } catch (error) {
    return console.log(error)
  }
}
