import Countdown from 'public/countdown.js'
import wixAnimations from 'wix-animations'
import wixData from 'wix-data'
import wixLocation from 'wix-location'
import wixSite from 'wix-site'
import wixWindow from 'wix-window'

import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { format } from 'date-fns'

let timelineA = wixAnimations.timeline()
/**
 * @typedef {import('public/types').Event} Event
 * @typedef {import('public/types').SpecialEvent} SpecialEvent
 */

$w.onReady(async function () {
  const eventsQuery = await getEvents({
    end: new Date(),
    onHomePage: true,
    sorting: { field: 'eventEndDate', order: 'ascending' }
  })
  const specialEventsQuery = await getSpecialEvents({ date: new Date() })

  const parsedSpecialEvents = parseSpecialEvents(specialEventsQuery.items)
  const allEvents = [...eventsQuery.items, ...parsedSpecialEvents].sort(
    (a, b) => a.eventEndDate - b.eventEndDate
  )

  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)
  $w('#repeaterEvents').data = allEvents
  $w('#sectionUpcomingEvents')[allEvents.length ? 'expand' : 'collapse']()

  await setCommingUpEvent(allEvents)

  $w('#buttonWaysToGive').onClick(() => wixLocation.to('/ways-to-give'))

  const { countdownEndDate: targetDate, duration } =
    wixWindow.warmupData.get('CountdownData') ||
    (await wixData.get('Countdown', 'SINGLE_ITEM_ID', { suppressAuth: true }))

  const realCountdown = new Countdown(
    {
      daysText: $w('#days'),
      hoursText: $w('#hours'),
      minutesText: $w('#minutes'),
      secondsText: $w('#seconds')
    },
    $w('#message'),
    $w('#timerExpired'),
    $w('#logoBoulevardOnline'),
    targetDate == null ? null : new Date(targetDate),
    duration
  )

  realCountdown.startCountdown() // Prefetch

  const response = wixSite.prefetchPageResources({
    pages: ['/new']
  })

  if (response.errors) {
    // handle errors
  }

  const myArrowA = $w('#vectorArrowA')

  //Help section animation
  timelineA.add(myArrowA, {
    rotate: 180,
    duration: 200,
    easing: 'easeOutCirc'
  })

  $w('#buttonHelpOpen').onClick(() => {
    if ($w('#sectionHelpExpanded').collapsed) {
      timelineA.play()
      $w('#sectionHelpExpanded').expand()
    } else {
      timelineA.reverse()
      $w('#sectionHelpExpanded').collapse()
    }
  })
})

// Countdown container links to
export function countdownLive_click(event) {
  wixLocation.to('/online')
}

/**
 * @function prepareRepeaterEvents
 * @param {any} $item
 * @param {Event} itemData
 */
async function prepareRepeaterEvents($item, itemData) {
  $item('#buttonEvent').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape
  $item('#textEventName').text = itemData.eventTitle
  $item('#textDate').text = itemData?.eventEndDate
    ? format(itemData.eventEndDate, 'MMM d, yyyy')
    : '-'
  // $item('#textDate')[itemData?.isSpecial ? 'hide' : 'show']()
}

/**
 * @function setCommingUpEvent
 * @param {Event[]} allEvents
 */
async function setCommingUpEvent(allEvents) {
  const upcomingEvent = allEvents
    .filter((event) => !event.eventNotFeatured)
    //@ts-ignore
    .sort((a, b) => a.eventStartDate - b.eventStartDate)[0]

  $w('#imageComingUp').src = upcomingEvent.eventImageLandscape
  $w('#buttonFeaturedEvent').link = upcomingEvent['link-events-eventTitle']
}
