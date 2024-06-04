import wixData from 'wix-data'
import wixLocation from 'wix-location'
import wixSite from 'wix-site'

import { format } from 'date-fns'
import { getEvents, getSpecialEvents, parseSpecialEvents } from 'public/data'
import { Ministries } from 'public/types'
import { setColorsFullAlpha, setElementOpacity } from 'public/utils.js'
// Resource type selection array this is a global variable which could be managed in browser cache
let arrKeyword = []

// resourceTypeSelection:
// Decide if we want to allow multiple resource types to be selected or only one type at a time
// Define constants to ensure understanding and config status
const RESOURCE_TYPE_SELECTION_SINGLE = 'single' // Constant used when only a single Resource type may be selected
const RESOURCE_TYPE_SELECTION_MULTIPLE = 'multi' // Constant used when multiple Resource types may be selected
// Config variable used to establish mode of use or the filter
// This is used to preserve the model for William to study and replicate if necessary elsewhere.
// NOTE: This needs to be let and not const to allow the conditional tests in the code to work.
let resourceTypeSelection = RESOURCE_TYPE_SELECTION_SINGLE // We only want to allow a single resource type at a time

// overrideResourceRepeaterPageSize:
// Set to true if the filtered dataset is likely to be larger then the default repeater length of 12 items.
// Otherwise set to false and the actual repeater page size will be used
let overrideResourceRepeaterPageSize = true

// Our main onReady event handler we will use asynch as the mode of use so that
// we can simplify the use of promise based functions.

/**
 * @typedef {import('public/types').Event} Event
 */

/**
 * @function prepareRepeaterEvents
 * @param {any} $item
 * @param {Event} itemData
 */
async function prepareRepeaterEvents($item, itemData) {
  $item('#buttonEvent').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape
  $item('#textEventName').text = itemData.eventTitle
  $item('#textDate').text = itemData?.eventStartDate
    ? format(itemData.eventStartDate, 'MMM d, yyyy')
    : '-'
  $item('#textTime').text = itemData?.eventStartDate
    ? format(itemData.eventStartDate, 'h:mm a')
    : '-'
}

$w.onReady(async function () {
  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)

  const eventsQuery = await getEvents({
    start: new Date(),
    ministries: [Ministries.BoulevardKidsWest]
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
  $w('#noResText')[allEvents.length ? 'hide' : 'show']()
  // Configure handlers
  // Only create handler once in the onReady scope

  // Prefetch
  let response = wixSite.prefetchPageResources({
    lightboxes: ['BkEastFB'],
    pages: ['/boulevard-kids-east']
  })

  // RESOURCES hide & show text, color control
  $w('#repeaterResourceType').onItemReady(adjustResourceTypeItem)
  $w('#buttonItem').onClick(filterByResourceType)
  $w('#expandResourceSelection').onClick(loadMoreResourcesToggle)

  console.log(`preFetchResponse: ${JSON.stringify(response)}`)

  collapseLoaderGif()

  onReadyActions()
})

function onReadyActions() {
  // Staff Email Buttons
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=BK Wets'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })

  // Dropdown Navigation
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  // No Serve Repeater Results
  $w('#datasetServe').onReady(() => {
    let count = $w('#datasetServe').getTotalCount()
    $w('#sectionServe')[count > 0 ? 'expand' : 'collapse']()
  })
}

// What to Expect
export function buttonNursery_click(event) {
  $w('#buttonNursery').disable()
  $w('#buttonPreschool').enable()
  $w('#buttonElementary').enable()
  $w('#multiStateWhat').changeState('stateA')
}

export function buttonPreschool_click(event) {
  $w('#buttonNursery').enable()
  $w('#buttonPreschool').disable()
  $w('#buttonElementary').enable()
  $w('#multiStateWhat').changeState('stateB')
}

export function buttonElementary_click(event) {
  $w('#buttonNursery').enable()
  $w('#buttonPreschool').enable()
  $w('#buttonElementary').disable()
  $w('#multiStateWhat').changeState('stateD')
}

/*
 * EVENT HANDLER FUNCTIONS
 *
 * These are configured by the event handler set up functions that are configured in the
 * main $w.onReady() event handler
 */

// Used to adjust the colors of the resource Type tiles in the repeater
function adjustResourceTypeItem($item, itemData, index) {
  if (itemData.color) {
    $item('#itemResourceType').style.backgroundColor = itemData.color
  } else {
    $item('#itemResourceType').style.backgroundColor = '#36424a'
  }
}

// click handler used to filter the resources by resource type
// Assumes that the element being clicked is inside of a repeater
async function filterByResourceType(event) {
  // Show filter is working by showing the loaderGif
  expandLoaderGif()

  // Create the scope item from the event context
  let $item = $w.at(event.context)

  // Get the current item from the related dataset
  let itemData = $item('#datasetResourceType').getCurrentItem()
  let indexOfResource = arrKeyword.indexOf(itemData.title)

  // Prepare the filter list for the dataset
  if (resourceTypeSelection === RESOURCE_TYPE_SELECTION_MULTIPLE) {
    // In this scenario the resource selected icon ( the "X" icon used in the selection repeater ) is used as a button to remove a selected resource type from
    // the list that can be created in arrKeyword.
    // Whenever a resource is selected the arrKeyword filter is updated (either by removing the title or adding it).
    //   -  If the #resourceSelected button is expanded then the resource has already been selected so the itemData.title is removed and the icon is collapsed.
    //   -  If the #resourceSelected button is collapsed then the resource has not yet been added to the filter. So we add it and expand the icon.
    //      NOTE: We could also check to see if itemData.title is already in arrKeyword but the logic here is simple enough that we don't need to use this method.
    if ($item('#resourceSelected').collapsed) {
      // itemData.title is not in the arrKeyword list so we add it.
      arrKeyword.push(itemData.title)
      // Display the #resourceSelected icon
      $item('#resourceSelected').expand()
      // Disable the resource type button for this repeater selection
      $item('#buttonItem').disable()
    } else {
      // itemData.title is in the arrKeyword list
      // collapse the resource selected icon
      $item('#resourceSelected').collapse()
      // re-enable the resource type so that it can be selected again
      $item('#buttonItem').enable()
      // Remove the resource title from the list
      // Check if there is a related entry (there should be but we don't want to waste time if not)
      if (indexOfResource > -1) {
        // The index is not -1 so we have found the title
        // Use the index to remove the title value from the filter
        arrKeyword.splice(indexOfResource, 1)

        // Now that we have removed the resource title then we need to set the indexOfResource
        // to say it isn't there and force a filter event
        indexOfResource = -1
      }
    }
  } else if (
    resourceTypeSelection === RESOURCE_TYPE_SELECTION_SINGLE &&
    indexOfResource === -1
  ) {
    // In this scenario we are only allowing a single type selection so we don't need to do anything if the item selected has already been selected
    // arrKeyword will already contain itemData.title and indexOfResource will not be -1. We only come through this code when a new resource type is selected.
    // Start by resetting the arrKeyword and adding the new title
    arrKeyword = []
    arrKeyword.push(itemData.title)

    // Now collapse the visible resourceSelected icon and wait for the collapse to take effect. This will result in a better user experience
    // Don't collapse as we will now reset colors to 100% instead
    //await collapseElementsInRepeater("#resourceSelected", "#repeaterResourceType");
    await setColorsFullAlpha('#itemResourceType', '#repeaterResourceType')

    // Expand the resource selected element for this resource type
    //$item('#resourceSelected').expand();
    // Change opacity of the selected button
    setElementOpacity($item, '#itemResourceType', 0.3)

    /*$item('#buttonItem').disable();*/ //William added this, didn't work as expected
  }

  console.log(arrKeyword)

  // Run the filter only if we haven't seen this resource to filter by yet
  if (indexOfResource === -1) {
    setResourcesLoadedMessage(`Loading...`)

    // Collapse and expand resource list to verify that the filter request has executed
    // $w('#repeaterResources').collapse(); // Don't need this

    // Run the filter on the new list
    await $w('#datasetBKResources').setFilter(
      wixData
        .filter()
        .hasSome('resourceTypeTitle', arrKeyword)
        .hasSome('resourceCampus', ['ede394da-93a1-4b61-b59f-c81453e557d1'])
    )

    let totalAfterFilter = $w('#datasetBKResources').getTotalCount()

    if (overrideResourceRepeaterPageSize && totalAfterFilter > 0) {
      // Force repeater page size from filtered collection
      await $w('#datasetBKResources').setPageSize(totalAfterFilter)
    }

    // Get our, potentially adjusted, pagesize
    let pageSize = $w('#datasetBKResources').getPageSize()

    if (totalAfterFilter !== 0) {
      /*setResourcesLoadedMessage(`Resources available: ${totalAfterFilter}, showing ${pageSize < totalAfterFilter ? pageSize : totalAfterFilter}`);*/
      setResourcesLoadedMessage(
        `${$w('#datasetBKResources').getTotalCount()} resources`
      )

      // Uses a utility function to manage the item configuration.
      $w('#repeaterResources').forEachItem(loadItemInfo)

      // Expand resource list to verify that the filter request has executed
      $w('#repeaterResources').expand()
    } else {
      // Hide the message block by sending a null message
      setResourcesLoadedMessage()
    }
  }

  // Hide filter is working by showing the loaderGif

  collapseLoaderGif()
}

async function loadMoreResourcesToggle(event) {
  // Get the number of items being displayed
  let repeaterLength = $w('#datasetBKResources').getPageSize()

  setResourcesLoadedMessage(`Working please wait...`)

  // Collapse and expand resource list to verify that the filter request has executed
  $w('#repeaterResources').collapse()

  if (repeaterLength === 12) {
    await $w('#datasetBKResources').setPageSize(
      $w('#datasetBKResources').getTotalCount()
    )
    $w('#expandResourceSelection').label = 'Show Less?'
  } else {
    await $w('#datasetBKResources').setPageSize(12)
    $w('#expandResourceSelection').label = 'Show More?'
  }

  setResourcesLoadedMessage(
    `Resources available: ${$w(
      '#datasetBKResources'
    ).getTotalCount()}, showing ${$w('#datasetBKResources').getPageSize()}`
  )

  // Uses a utility function to manage the item configuration.
  $w('#repeaterResources').forEachItem(loadItemInfo)

  // Collapse and expand resource list to verify that the filter request has executed
  $w('#repeaterResources').expand()
}

function loadItemInfo($item, itemData, index) {
  let image = itemData.resourceImageA
  let labelA = itemData.resourceLabel
  let labelB = itemData.resourceBLabel
  let resourceRichText = itemData.resourceRichText
  let resourceTypeTitle = itemData.resourceTypeTitle
  let resourceURL = itemData.resourceUrl
  let resourceUrlB = itemData.resourceUrlB

  $item('#textBKResource').text = itemData.title
  $item('#textResourceText').html = resourceRichText || ''
  $item('#buttonResourceA').label = labelA || 'OPEN'
  $item('#buttonResourceA').link = resourceURL || ''
  $item('#buttonResourceB').label = labelB || 'DOWNLOAD'
  $item('#buttonResourceB').link = resourceUrlB || ''
  $item('#imageResource').src =
    image ||
    'https://static.wixstatic.com/media/77e3c1_4bd0502e295b4b37b0489a60a878efc2~mv2.png'
  $item('#audioPlayer2').src = resourceURL || ''

  if (resourceRichText) {
    $item('#textResourceText').expand()
    $item('#buttonResourceA').hide()
  } else {
    $item('#textResourceText').collapse()
    $item('#buttonResourceA').show()
  }

  if (resourceUrlB) {
    $item('#buttonResourceB').expand()
  } else {
    $item('#buttonResourceB').collapse()
  }

  $item('#buttonResourceA').expand()
  $item('#audioPlayer2').collapse()

  switch (resourceTypeTitle[0]) {
    case 'Audio Book':
      {
        $item('#buttonResourceA').collapse()
        $item('#audioPlayer2').expand()
      }
      break

    case 'RightNow Media':
      {
        $item('#buttonResourceA').label = 'GO'
        //$w("#buttonResourceA").show();
        //$w("#buttonResourceA").expand();
      }
      break

    case 'Video':
      {
        $item('#buttonResourceA').label = labelA
      }
      break
  }
}

/*
 * UTILITY FUNCTIONS
 *
 * These are used to accomplish a particular task on this page
 */
async function setResourcesLoadedMessage(message) {
  // Set the message text
  $w('#resourcesLoadedMessage').text = message || ''

  if (overrideResourceRepeaterPageSize) {
    // We are always loading all repeater items so hide the expandResourceSelection toggle button because we don't need it
    await $w('#expandResourceSelection').collapse() // Make sure the buton is hidden before the message box is revealed
  }

  if (message) {
    $w('#resourceMessageBox').expand()
  } else {
    // An empty message is a convenient way to switch off the message block
    $w('#resourceMessageBox').collapse()
  }
}

async function expandLoaderGif() {
  await $w('#loaderGif').expand()
}

async function collapseLoaderGif() {
  await $w('#loaderGif').collapse()
}
