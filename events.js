import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js'
import { getAllEvents } from 'backend/database/events.web'
import { format } from 'date-fns'

/**
 * @typedef {import('public/types/events').Event} Event
 */

/**
 *
 * @param {any} $item
 * @param {Event} itemData
 */
const prepareRepeaterEvents = async ($item, itemData) => {
  $item('#textEventTitle').text = itemData.eventTitle
  $item('#textDate').text = format(itemData.eventStartDate, 'MMM d, yyyy')
  $item('#textTime').text = format(itemData.eventStartDate, 'h:mm a')
  $item('#textLocation').text = itemData.eventLocationName
  $item('#buttonRegister').link = itemData.eventRegistrationUrl
  $item('#buttonMoreInfo').link = itemData['link-events-eventTitle']
  $item('#imageEvent').src = itemData.eventImageLandscape

  let campuses = itemData
    ? await getMultiReferencePropertyFromCollection(
        'eventAssociatedCampuses',
        'Events',
        itemData._id
      )
    : []
  console.log(
    `campuses [${campuses.length}] event: [${
      itemData.eventTitle
    }] color ${JSON.stringify($item('#tagCampus').style)}`
  )

  debugger

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

  $item('#textTime')[itemData.isSpecial ? 'hide' : 'show']()
  $item('#textDate')[itemData.isSpecial ? 'hide' : 'show']()
  $item('#textLocation')[itemData.isSpecial ? 'hide' : 'show']()
}

$w.onReady(async () => {
  const allEvents = await getAllEvents({ end: new Date(), onHomePage: false })

  $w('#repeaterEvents').onItemReady(prepareRepeaterEvents)
  $w('#repeaterEvents').data = allEvents

  //});

  // No Repeater Results
  // function errorTextResult() {
  //     $w("#datasetEvents").onReady(() => {
  //         let count = $w("#datasetEvents").getTotalCount();

  //         if (count > 0) {
  //             $w('#noResText').hide();

  //         }
  //         if (count === 0) {
  //             $w('#noResText').show();
  //         }
  //     });
  // }
})

// export async function repeater1_itemReady($item, itemData, index) {

// 	let ministries = await wixData.queryReferenced("Events",itemData._id , "eventMinistries")

//     if(ministries.items.length > 0){

//         let opt =  ministries.items

//         let option =opt.map(item=>{return{  value:item.ministryTitle  ,label:item.ministryTitle }})

//         $item('#ministriesTags').options = option

//     }else{ $item('#ministriesTags').options = []}

//     let campuses = await wixData.queryReferenced("Events",itemData._id , "eventAssociatedCampuses")

//     if(campuses.items.length > 0){

//         let opt = campuses.items

//         let optionCampus =opt.map(item=>{return{  value:item.campusFullTitle  ,label:item.campusFullTitle }})

//         $item('#campusTagSelection').options = optionCampus

//     }else{ $item('#campusTagSelection').options = []}
// }

// export function loadmoreButton_click(event) {
// 	$w("#datasetEvents").loadMore()
// }
