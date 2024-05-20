import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixAnimations from 'wix-animations';
import wixSite from 'wix-site';
import Countdown from 'public/countdown.js';

let timelineA = wixAnimations.timeline();

$w.onReady(async function () {
    $w('#buttonWaysToGive').onClick(() => wixLocation.to('/ways-to-give'))

    const { countdownEndDate: targetDate, duration } = wixWindow.warmupData.get("CountdownData") || await wixData.get('Countdown', 'SINGLE_ITEM_ID', { suppressAuth: true });

    const realCountdown = new Countdown({
        daysText: $w("#days"),
        hoursText: $w("#hours"),
        minutesText: $w("#minutes"),
        secondsText: $w("#seconds"),
    }, $w("#message"), $w("#timerExpired"), $w("#logoBoulevardOnline"), targetDate == null ? null : new Date(targetDate), duration);

    realCountdown.startCountdown(); // Prefetch

    const response = wixSite.prefetchPageResources({
        "pages": ["/new"]
    });

    if (response.errors) {
        // handle errors
    }

    // }

    const myArrowA = $w("#vectorArrowA");

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
    var today = new Date();
    $w('#datasetFeaturedEvent').setFilter(wixData.filter()
            .ge('eventEndDate', today)
            .eq('eventOnHomepage', true)
            .ne('ministrySpecificEvent', true)
            .ne('eventNotFeatured', true)
            .ne('eventIsHidden', true)
        )
        .then(() => {

        })

    //filter Event slider
    var today = new Date();

    $w('#datasetEvents').setFilter(wixData.filter()
            .ge('eventEndDate', today)
            .eq('eventOnHomepage', true)
            .ne('ministrySpecificEvent', true)
            .ne('eventIsHidden', true)
        )
        .then(() => {
            errorTextResult()
        })

    // No Event Repeater Results
    function errorTextResult() {
        $w("#datasetEvents").onReady(() => {
            let count = $w("#datasetEvents").getTotalCount();

            if (count > 0) {
                $w('#sectionUpcomingEvents').expand();

            }
            if (count === 0) {
                $w('#sectionUpcomingEvents').collapse();
            }

        });
    }

    // redirect Featured Event if redirect url exists
    // this code does not work
    $w("#datasetFeaturedEvent").onReady(() => {
        let item = $w("#datasetFeaturedEvent").getCurrentItem();
        let featuredRedirectUrl = item.redirectUrl;

        item.redirectUrl ? $w("#buttonFeaturedEvent").link = featuredRedirectUrl : $w("#buttonFeaturedEvent").link;
    });

    // redirect Event if redirect url exists
    $w("#repeaterEvents").onItemReady(async ($item, itemData, index) => {
        let redirectUrl = itemData.redirectUrl;
        let isSpecial = itemData.isSpecial;

        
                // redirect from dynamic event page to another page
                if (redirectUrl) {
                    $item("#buttonEvent").link = redirectUrl;
                    $item("#buttonEvent").target = "_self";
                } else {
                    $item("#buttonEvent").link;
                }
        
        //collapse date&time&location if Special
        
        if (isSpecial) {
            $item("#textDate").hide()
        } else {
            $item("#textDate").show()
        }

    });

    //Help section animation
    timelineA
        .add(myArrowA, {
            "rotate": 180,
            "duration": 200,
            "easing": "easeOutCirc"
        });

    $w("#buttonHelpOpen").onClick(() => {
        if ($w("#sectionHelpExpanded").collapsed) {
            timelineA.play();
            $w("#sectionHelpExpanded").expand();

        } else {
            timelineA.reverse();
            $w("#sectionHelpExpanded").collapse();
        }

    });

});

// Countdown container links to
export function countdownLive_click(event) {
    wixLocation.to("/online");
}