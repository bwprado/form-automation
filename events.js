// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js';

$w.onReady(() => {

    //filter past Event Dates
    var today = new Date();
    $w('#datasetEvents').setFilter(wixData.filter()
            .ge('eventEndDate', today)
            .ne('ministrySpecificEvent', true)
            //.eq('eventIsFeatured', true)
            .ne('eventIsHidden', true)
            //.ne('isSpecial', true)
        )
        .then(() => {
            // No Events Message
            // errorTextResult();
            console.log("Dataset Filtered");
        })
 


    //$w("#datasetEvents").onReady(() => {
    $w("#repeaterEvents").onItemReady(async ($item, itemData, index) => {
        let redirectUrl = itemData.redirectUrl;
        let isSpecial = itemData.isSpecial;
        /*
        // expand button if register url exists
            if (itemData.eventRegistrationUrl) {
                $item("#buttonRegister").expand();
            } else {
                $item("#buttonRegister").collapse();
            }
        */

        let campuses = itemData ? await getMultiReferencePropertyFromCollection("eventAssociatedCampuses", "Events", itemData._id) : [];
        console.log(`campuses [${campuses.length}] event: [${itemData.eventTitle}] color ${JSON.stringify($item('#tagCampus').style)}`);

        debugger;

        if (campuses.length === 1) {
            $item('#tagCampus').label = campuses[0].campusFullTitle;
            $item('#tagCampus').expand().catch(error => console.log(`Show Error: ${error.message}`));
        } else if (campuses.length > 1) {
            $item('#tagCampus').label = "All Campuses";
            $item('#tagCampus').expand().catch(error => console.log(`Show Error: ${error.message}`));
        } else {
            $item('#tagCampus').label = "";
            $item('#tagCampus').collapse().catch(error => console.log(`Hide Error: ${error.message}`));
        }

        //collapse date&time&location if Special
        if (isSpecial) {
            $item("#textTime").hide()
            $item("#textDate").hide()
            $item("#textLocation").hide()
        } else {
            $item("#textTime").show()
            $item("#textDate").show()
            $item("#textLocation").show()
        }



        // redirect from dynamic event page to another page
        if (redirectUrl) {
            $item("#buttonMoreInfo").link = redirectUrl;
            $item("#buttonMoreInfo").target = "_self";
        } else {
            $item("#buttonMoreInfo").link;
        }

    });
    

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
});

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
