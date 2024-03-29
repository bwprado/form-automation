import wixData from "wix-data"
import { Buffer } from "buffer"
import { redirect } from "wix-router"
import { mediaManager } from "wix-media-backend"
import { serverError, badRequest } from "wix-http-functions"
import { getYear, getMonth, getDate, getHours, getMinutes } from "date-fns"

/**
 * @author Bruno Prado for Threed Software
 * @description This function receives a request to the /eventsxml endpoint and returns an iCalendar file
 * @param {any} request
 * @returns {Promise<any>}
 */
export async function eventsxml_Router(request) {
  const ics = require("ics")
  let options = {
    headers: {
      "Content-Type": "text/document"
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

    const buffer = Buffer.from(value)
    const icsFile = await mediaManager.upload(
      "iCalendar",
      buffer,
      "events.ics",
      {
        mediaOptions: {
          mimeType: "text/calendar",
          mediaType: "document"
        },
        metadataOptions: {
          isPrivate: false,
          isVisitorUpload: true
        }
      }
    )
    const wixUrl = icsFile?.fileUrl

    if (!wixUrl) return console.log("No file URL returned")

    const downloadUrl = await mediaManager.getFileUrl(wixUrl)
    return redirect(downloadUrl, "200")
  } catch (error) {
    return serverError(error)
  }
}
