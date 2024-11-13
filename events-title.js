// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { session } from 'wix-storage';
import { getMultiReferencePropertyFromCollection } from 'public/dataUtilities.js';

//let previousPageURL;

$w.onReady(() => {
    // //back button
    // previousPageURL = session.getItem("page");
    // console.log(previousPageURL);
    // session.setItem("page", wixLocation.url);
    // $w("#buttonBackEvents").link = previousPageURL;
    // $w("#buttonBackEvents").target = "_self";

    // Sets the formatting options for the date
    const optionStart = {
        weekday: "long",
        day: "numeric",
        month: "short",
        //year: "numeric"
    };
    const optionEnd = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    $w("#dynamicDataset").onReady(() => {
        let item = $w("#dynamicDataset").getCurrentItem();
        let buttonLabel = item.buttonALabel;

        // Get the date from the date field of the current item
        const startDate = $w("#dynamicDataset").getCurrentItem().eventStartDate;
        const endDate = $w("#dynamicDataset").getCurrentItem().eventEndDate;

        // Sets the property of the text element to be a string representing today's date in US English
        // this works but changed design and don't need it: $w("#textEventDate").text = startDate.toLocaleDateString("en-US", optionStart) + " - " + endDate.toLocaleDateString("en-US", optionEnd);
        $w("#textDateStart").text = startDate.toLocaleDateString("en-US", optionStart);
        $w("#textDateEnd").text = endDate.toLocaleDateString("en-US", optionEnd);

        // expand/collapse learn more buttons
        // item.serveForm ? $w("#buttonVolunteer").expand() : $w("#buttonVolunteer").collapse();

        // show/hide register button
        item.eventRegistrationUrl ? $w("#buttonRegister").expand() : $w("#buttonRegister").collapse();

        // register button label defaults to Register, but can be overwriiten in the Collection
        item.buttonALabel ? $w("#buttonRegister").label = buttonLabel : $w("#buttonRegister").label = "Register"

        // expand/collapse date, time, location
        item.isSpecial ? $w("#boxWhenAndWhere").collapse() : $w("#boxWhenAndWhere").expand();

        /*
            //new attempt also does not work
            $w("#datasetServe").onReady(() => {
                    let count = $w("#datasetServe").getTotalCount();

                    if (count > 0) {
                        $w('#sectionOpportunities').expand();

                    }
                    if (count === 0) {
                        $w('#sectionOpportunities').collapse();
                    }
        */

        /*  // this code does not work
            $w("#repeaterServing").onItemReady(async ($item, itemData, index) => {

                    let opportunities = itemData ? await getMultiReferencePropertyFromCollection("serviceOpportunities", "Events", itemData._id) : [];
                    //console.log(`opportunities [${opportunities.length}] event: [${itemData.eventTitle}] color ${JSON.stringify($item('#buttonVolunteer').style)}`);

                    //debugger;

            // only show section if multi-reference exists in database
                    if (opportunities.length > 1) {
                        $item("#sectionOpportunities").expand();
                    } else {
                        $item("#sectionOpportunities").collapse();
                    }

            // only show button if form link exists in database
                    if (itemData.serveForm) {
                        $item("#buttonVolunteer").enable();
                        $item("#buttonVolunteer").show();
                    } else {
                        $item("#buttonVolunteer").disable();
                        $item("#buttonVolunteer").hide();
                    }

                    
            })
        */

        // expand/collapse service section
        // this code does not work item.serviceOpportunities ? $w("#sectionOpportunities").expand() : $w("#sectionOpportunities").collapse();

        // expand/collapse associated ministries section
        // this code does not work item.eventMinistries ? $w("#sectionMinistries").expand() : $w("#sectionMinistries").collapse();

        // which image to display
        let eventVideo = item.eventVideo;
        let videoUrl = item.eventVideo;

        if (eventVideo === undefined) {
            $w("#boxCoverVideo").show();
            $w("#videoPlayer1").hide();
            $w("#videoPlayer1").src = videoUrl;
        } else {
            $w("#boxCoverVideo").hide();
            $w("#videoPlayer1").show();
            $w("#videoPlayer1").src = videoUrl;
        }

    })

    // this was useful before launch but is no longer needed
    $w("#datasetMinistries").onReady(() => {
        // console.log('dataset ready')

        $w("#repeaterMinistries").onItemReady(async ($item, itemData, index) => {

            let ministryUrl = itemData.ministryUrl;

            if (ministryUrl) {
                $item("#imageMinistry").link = ministryUrl;
            } else {
                $item("#imageMinistry").link;
            }
        })
    })

    $w("#datasetServe").onReady(() => {
        // console.log('dataset ready')

        $w("#repeaterServing").onItemReady(async ($item, itemData, index) => {

            let serveForm = itemData.serveForm;

            if (serveForm) {
                $item("#buttonVolunteer").show();
            } else {
                $item("#buttonVolunteer").hide();
            }
        })
    })

})