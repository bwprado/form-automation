import wixData from "wix-data"
import { Buffer } from "buffer"
import { getYear, getMonth, getDate, getHours, getMinutes } from "date-fns"
import {
  response,
  badRequest,
  serverError,
  WixHttpFunctionRequest
} from "wix-http-functions"

/**
 * @author Bruno Prado for Threed Software
 * @description Returns a list of events in ICS format string from the Events collection
 * @param {WixHttpFunctionRequest} request
 * @returns {Promise<any>}
 */
export async function get_eventsxml(request) {
  const ics = require("ics")
  let options = {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename=nbevents${Date.now()}.ics`
    }
  }

  const { query } = request || {}

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

    const formattedItems = formatDataForICS(items)

    const { error, value } = ics.createEvents(formattedItems)
    if (error) return serverError(error)

    const buffer = Buffer.from(value)

    options =
      items.length > 0
        ? { body: buffer, status: 200, ...options }
        : { body: "No events found", status: 404, ...options }

    return response(options)
  } catch (error) {
    return serverError(error)
  }
}

/**
 * This function formats the data from the Events collection to fit the ICS properties
 *
 * @author Bruno Prado for Threed Software
 * @param {object} data - Data to be formatted
 * @returns {object} - Formatted data to fit ICS properties
 */
function formatDataForICS(data) {
  return data.map(
    ({
      eventTitle,
      eventStartDate,
      richDescription,
      eventDescription,
      eventLocationAddress,
      ["link-events-eventTitle"]: eventRegistrationUrl
    }) => ({
      start: [
        getYear(eventStartDate),
        getMonth(eventStartDate) + 1,
        getDate(eventStartDate),
        getHours(eventStartDate),
        getMinutes(eventStartDate)
      ],
      title: eventTitle,
      url: `https://www.northboulevard.com${eventRegistrationUrl}`,
      description: eventDescription,
      htmlContent: formatHTMLforICS(
        eventTitle,
        eventDescription,
        eventRegistrationUrl
      ),
      location: eventLocationAddress
    })
  )
}

function formatHTMLforICS(title, description, url) {
  return `<!DOCTYPE html><html><head><title>${title}</title><link rel="stylesheet" type="text/css" href="styles.css"></head><body><h1>This is the Title</h1><p>${description}</p><a href="${`https://www.northboulevard.com${url}`}" style="text-decoration:none"><button style="background:rgba(133,197,76,.81);height:40px;border:none;border-radius:8px;box-shadow:rgba(0,0,0,.15) .17px .98px 25px 5px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:700;font-size:16px;padding:1.5rem;display:flex;align-items:center;justify-content:center;color:#fff">Learn More</button></a></body></html>`
}
