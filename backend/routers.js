import wixData from "wix-data"
import { Buffer } from "buffer"
import { next, redirect, WixRouterRequest, WixRouterResponse, WixRouterUser, ok } from "wix-router"
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

    console.log(request)
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
            "events.ics", {
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

/**
 * @author Christopher Derrell for Threed Software
 * @description This function handles the routing of events. pages. These must have the URL
 * @param {WixRouterRequest} request
 * @returns Promise<WixRouterResponse>
 */
/*
export async function event_afterRouter(request) {
    console.log("Events after Request");
    console.log(request);

    const { items, totalCount } = await wixData.query('Events').eq('link-events-eventTitle', `${request.prefix}/${request.path[0]}`).isNotEmpty('redirectUrl').find();
    if (totalCount > 0) {
        console.log("Redirect found for this event");
        // return redirect(items[0])
        return ok('Events (Title)',{},{
            metaTags:[{
                "http-equiv":"refresh",
                content:"0;url="+items[0],
            }]
        });
    } else next();

}
*/
/**
 * @author Christopher Derrell for Threed Software
 * @description This function handles the routing before events. These must have the URL
 * @param {WixRouterRequest} request
 * @returns Promise<WixRouterResponse>
 */
/*
export async function event_beforeRouter(request) {
    console.log("Events before Request");
    console.log(request);

    //We're going to check for the redirect URL

    const { items, totalCount } = await wixData.query('Events').eq('link-events-eventTitle', `${request.prefix}/${request.path[0]}`).isNotEmpty('redirectUrl').find();
    if (totalCount > 0) { console.log("Redirect found for this event"); return redirect(items[0]) } else next();
}
*/