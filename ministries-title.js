import wixData from 'wix-data'

import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'

/**
 * @typedef {import('public/types').Event} Event
 */

/**
 * @function prepareRepeaterEvents
 * @description Prepare the events repeater
 * @param {any} $item
 * @param {Partial<Event>} itemData
 */
const prepareRepeaterEvents = async ($item, itemData) => {
  $item('#textEventTitle').text = itemData.eventTitle
  $item('#textEventDate').text = format(itemData.eventStartDate, 'MMM d, yyyy')
  $item('#textEventTime').text = itemData?.eventStartDate
    ? format(itemData.eventStartDate, 'h:mm a')
    : ''
  $item('#textEventLocation').text = itemData.eventLocationName
  $item('#buttonRegister').link = itemData?.eventRegistrationUrl || ''
  $item('#buttonMoreInfo').link = itemData['link-events-eventTitle']
  $item('#buttonEventInfo').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape

  $item('#buttonRegister')[
    itemData?.eventRegistrationUrl ? 'expand' : 'collapse'
  ]()

  let campuses = itemData?._id
    ? await getMultiReferencePropertyFromCollection(
        itemData?.isSpecial ? 'campuses' : 'eventAssociatedCampuses',
        itemData?.isSpecial ? 'SpecialEvent' : 'Events',
        itemData._id
      )
    : []

  if (campuses.length === 1) {
    $item('#tagCampus').label = campuses[0].campusFullTitle
    $item('#tagCampus')
      .expand()
      .catch((error) => console.log(`Show Error: ${error.message}`))
  } else if (campuses.length > 1) {
    $item('#tagCampus').label = 'All Campuses'
    $item('#tagCampus')
      .expand()
      .catch((error) => console.log(`Show Error: ${error.message}`))
  } else {
    $item('#tagCampus').label = ''
    $item('#tagCampus')
      .collapse()
      .catch((error) => console.log(`Hide Error: ${error.message}`))
  }
}

$w.onReady(async function () {
  $w('#dynamicDataset').onReady(async () => {
    let dynamicItem = $w('#dynamicDataset').getCurrentItem()
    let ministryTitle = dynamicItem._id
    let serveTitle = dynamicItem._id

    $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)

    const eventsQuery = await getEvents({
      start: new Date(),
      ministries: [ministryTitle]
    })
    const specialEventsQuery = await getSpecialEvents({
      date: new Date()
    })

    const allEvents = [
      ...eventsQuery.items,
      ...parseSpecialEvents(specialEventsQuery.items)
    ].sort((a, b) => a.eventStartDate - b.eventStartDate)

    $w('#repeaterEvents').data = allEvents

    $w('#sectionEvents')[allEvents.length ? 'expand' : 'collapse']()

    // Staff Contact Emails
    $w('#repeaterContact').onItemReady(($item, itemData, index) => {
      if (itemData.email) {
        $item('#buttonContact').link =
          'mailto:' + itemData.email + '?subject=NB Ministry'
        $item('#buttonContact').show()
      } else {
        $item('#buttonContact').hide()
      }

      $w('#textContactCampus').text = itemData.jobTitle3
        ? itemData.jobTitle3
        : 'Ministries Leader'
    })

    // Ministry Video
    if (dynamicItem.ministryVideo) {
      $w('#imagePlayVideo').expand()
      //$w("#videoPlayer1").expand();
    } else {
      $w('#imagePlayVideo').collapse()
      //$w("#videoPlayer1").collapse();
    }

    // Class Recordings
    if (dynamicItem.learningUrl) {
      $w('#sectionReferencedClass').expand()
    } else {
      $w('#sectionReferencedClass').collapse()
    }

    //Collapse/Expand Photo section
    if (dynamicItem.photoA && dynamicItem.photoB && dynamicItem.photoC) {
      $w('#sectionPhotos').expand()
      $w('#sectionSpacer').collapse()
    } else {
      $w('#sectionPhotos').collapse()
      $w('#sectionSpacer').expand()
    }

    $w('#datasetServe')
      .setFilter(
        wixData
          .filter()
          .ge('endDate', new Date())
          .hasSome('Ministries', [serveTitle])
      )
      .then(() => {
        noServe()
      })

    // No Serve Repeater Results
    function noServe() {
      $w('#datasetServe').onReady(() => {
        let count = $w('#datasetServe').getTotalCount()
        $w('#sectionOpportunities')[count > 0 ? 'expand' : 'collapse']()
      })
    }
  })

  // only show volunteer button if form link exists in database
  $w('#repeaterServe').onItemReady(($w, itemData, index) => {
    if (itemData.serveForm) {
      $w('#buttonVolunteer').enable()
      $w('#buttonVolunteer').show()
    } else {
      $w('#buttonVolunteer').disable()
      $w('#buttonVolunteer').hide()
    }
  })
})

export function imagePlayVideo_click(event) {
  $w('#imagePlayVideo').collapse()
  $w('#videoPlayer1').expand()
  $w('#videoPlayer1').play()
}

export function videoPlayer1_ended(event) {
  $w('#imagePlayVideo').expand()
  $w('#videoPlayer1').collapse()
}
