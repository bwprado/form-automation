import Countdown from 'public/countdown.js'
import wixAnimations from 'wix-animations'
import wixData from 'wix-data'
import wixLocation from 'wix-location'
import wixSite from 'wix-site'
import wixWindow from 'wix-window'

import {
  getEvents,
  getSpecialEventSchedule,
} from 'backend/database/events.web'
import { format } from 'date-fns'

let timelineA = wixAnimations.timeline()
/**
 * @typedef {import('public/types/events').Event} Event
 * @typedef {import('public/types/events').SpecialEvent} SpecialEvent
 */

$w.onReady(async function () {
  const events = await getEvents({ end: new Date(), onHomePage: true })
  const specialEvents = await getSpecialEventSchedule({ date: format(new Date(), "yyyy-MM-dd") })
  console.log({ events, specialEvents })
  const allEvents = [...events, ...specialEvents]

  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)
  $w('#repeaterEvents').data = allEvents
  $w('#sectionUpcomingEvents')[allEvents.length ? 'expand' : 'collapse']()

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

  // }

  const myArrowA = $w('#vectorArrowA')

  // original code for Countdown
  // $w('#boxCountdown').hide();

  // if (wixWindow.rendering.env === 'browser' || wixWindow.viewMode === 'Preview') {
  //     // only when in Front End so we get the user's local time (and not the server time)
  //     // otherwise, the display "flashes" - first the server's rendering, and then the local rendering

  //     const msSecond = 1000; // milliseconds in a second
  //     const msMinute = msSecond * 60; // milliseconds in minute
  //     const msHour = msMinute * 60; // milliseconds in

  //     // ======> set this to your event date and time <========
  //     let partyDate = new Date("Nov 14, 2021 10:20:00"); // set this field for your event start
  //     let partyLength = msHour * 1.25; // set this to the length of your event
  //     //-------------------------------------------------------

  //     let startParty = partyDate.getTime();
  //     let endParty = startParty + partyLength; // party ends after two hours

  //     let countdown = setInterval(function () {

  //         let now = new Date().getTime();
  //         let timeDiff;

  //         const dateOptions = {
  //             month: 'short',
  //             day: 'numeric',
  //             year: 'numeric',
  //             hour: 'numeric',
  //             minute: 'numeric'
  //         }
  //         if (now < startParty) {
  //             // countdown till party starts
  //             $w('#message').text = "NEXT LIVE STREAM";
  //             timeDiff = startParty - now;
  //         } else {
  //             // countdown till party over
  //             $w('#message').text = "WE'RE LIVE NOW";
  //             // $w('#vectorCircleRed').show();
  //             timeDiff = endParty - now;
  //         }

  //         let daysDiff = Math.floor(timeDiff / (msHour * 24));
  //         let hoursDiff = Math.floor((timeDiff % (msHour * 24)) / msHour);
  //         let minutesDiff = Math.floor((timeDiff % msHour) / msMinute);
  //         let secondsDiff = Math.floor((timeDiff % msMinute) / msSecond);

  //         $w("#days").text = "" + daysDiff;
  //         $w("#hours").text = "" + hoursDiff;
  //         $w("#minutes").text = "" + minutesDiff;
  //         $w("#seconds").text = "" + secondsDiff;
  //         $w('#boxCountdown').show();
  //     }, 1000);
  // }

  //filter Featured Event
  var today = new Date()
  $w('#datasetFeaturedEvent')
    .setFilter(
      wixData
        .filter()
        .ge('eventEndDate', today)
        .eq('eventOnHomepage', true)
        .ne('ministrySpecificEvent', true)
        .ne('eventNotFeatured', true)
        .ne('eventIsHidden', true)
    )
    .then(() => {})

  //filter Event slider
  var today = new Date()

  // redirect Featured Event if redirect url exists
  // this code does not work
  $w('#datasetFeaturedEvent').onReady(() => {
    let item = $w('#datasetFeaturedEvent').getCurrentItem()
    let featuredRedirectUrl = item.redirectUrl

    item.redirectUrl
      ? ($w('#buttonFeaturedEvent').link = featuredRedirectUrl)
      : $w('#buttonFeaturedEvent').link
  })

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
  $item('#textDate')[itemData?.isSpecial ? 'hide' : 'show']()
}
