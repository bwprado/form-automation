
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import wixData from 'wix-data';
import { memory } from 'wix-storage';

$w.onReady(async function () {
    //console.log('page ready')
    //await cacheServiceOpportunities();
    //console.log('page ready 2')
    $w("#dynamicDataset").onReady(async () => {
        let dynamicItem = $w("#dynamicDataset").getCurrentItem();
        // console.log(JSON.parse(memory.getItem(item._id)).length)

        /*
                let serviceOpportunities = 0;
                JSON.parse(memory.getItem(item._id))?.length > 0 && (serviceOpportunities = JSON.parse(memory.getItem(item._id)).length);

                if (serviceOpportunities === 1) {
                    $w("#textNumberOfOpportunities").text = `${serviceOpportunities} Opportunity`
                } else if (serviceOpportunities > 1) {
                    $w("#textNumberOfOpportunities").text = `${serviceOpportunities} Opportunities`
                } else {
                    $w("#textNumberOfOpportunities").text = `${serviceOpportunities} `
                    $w("#textNumberOfOpportunities").hide();
                }
                */

        /*
                //hide & show leader photos
                if (item.leaderAPhoto) {
                    $w("#imageMinistryLeaderA").show();
                } else {
                    $w("#imageMinistryLeaderA").hide();
                }

                if (item.leaderBPhoto) {
                    $w("#imageMinistryLeaderB").show();
                } else {
                    $w("#imageMinistryLeaderB").hide();
                }

                if (item.leaderCPhoto) {
                    $w("#imageMinistryLeaderC").show();
                } else {
                    $w("#imageMinistryLeaderC").hide();
                }

                if (item.leaderDPhoto) {
                    $w("#imageMinistryLeaderD").show();
                } else {
                    $w("#imageMinistryLeaderD").hide();
                }

                if (item.leaderEPhoto) {
                    $w("#imageMinistryLeaderE").show();
                } else {
                    $w("#imageMinistryLeaderE").hide();
                }
        */

        // Staff Contact Emails
        $w("#repeaterContact").onItemReady(($item, itemData, index) => {
            //let contactTitle = itemData.jobTitle3;

            if (itemData.email) {
                $item("#buttonContact").link = "mailto:" + itemData.email + "?subject=NB Ministry";
                $item("#buttonContact").show();
            } else {
                $item("#buttonContact").hide();
            }

            // I couldn't figure out how to get it to show the default text when there is no Job Title text
            //itemData.jobTitle3 ? $w("#textContactCampus").text = contactTitle : $w("#textContactCampus").text = "Ministries Leader"
        });

        /*
                // Staff Email (when there was only one button on each page)
                if (item.contactEmail) {
                    $w("#buttonContact").link = "mailto:" + item.contactEmail + "?subject=Hello!";
                    $w("#buttonContact").show();
                } else {
                    $w("#buttonContact").hide();
                }
        */

        // Ministry Video
        if (dynamicItem.ministryVideo) {
            $w("#imagePlayVideo").expand();
            //$w("#videoPlayer1").expand();
        } else {
            $w("#imagePlayVideo").collapse();
            //$w("#videoPlayer1").collapse();
        }

        // Class Recordings
        if (dynamicItem.learningUrl) {
            $w("#sectionReferencedClass").expand();
        } else {
            $w("#sectionReferencedClass").collapse();
        }

        //Collapse/Expand Photo section
        if (dynamicItem.photoA && dynamicItem.photoB && dynamicItem.photoC) {
            $w("#sectionPhotos").expand();
            $w("#sectionSpacer").collapse();
        } else {
            $w("#sectionPhotos").collapse();
            $w("#sectionSpacer").expand();
        }

        /*
                // Social icon
                if (item.ministrySocialUrl) {
                    $w("#imageFacebook").expand();
                } else {
                    $w("#imageFacebook").collapse();
                }
                */

        //filter past Event Dates
        let ministryTitle = dynamicItem._id;

        var today = new Date();
        $w('#datasetEvents').setFilter(wixData.filter()
                .ge('eventEndDate', today)
                .hasSome('eventMinistries', [ministryTitle])
                //.hasSome('eventMinistries', ["0eadd645-9354-4b52-a98d-1ae91f181eea"])
                //.ne('ministrySpecificEvent', true)
                //.eq('eventIsFeatured', true)
                .ne('eventIsHidden', true)
            )
            .then(() => {
                // No Events Message
                errorTextResult();
            })

        // No Event Repeater Results
        function errorTextResult() {
            $w("#datasetEvents").onReady(() => {
                let count = $w("#datasetEvents").getTotalCount();

                if (count > 0) {
                    $w('#sectionEvents').expand();

                }
                if (count === 0) {
                    $w('#sectionEvents').collapse();
                }
            });
        }

        //filter past Service Opportunities
        var today = new Date();
        let serveTitle = dynamicItem._id;

        $w('#datasetServe').setFilter(wixData.filter()
                .ge('endDate', today)
                .hasSome('Ministries', [serveTitle])
            )
            .then(() => {
                noServe();
            })

        // No Serve Repeater Results
        function noServe() {
            $w("#datasetServe").onReady(() => {
                let count = $w("#datasetServe").getTotalCount();

                if (count > 0) {
                    $w('#sectionOpportunities').expand();

                }
                if (count === 0) {
                    $w('#sectionOpportunities').collapse();
                }
            });
        }

    });

    // // show/hide event register button
    // $w("#datasetEvents").onReady(() => {
    //     $w("#repeaterEvents").onItemReady(($w, itemData, index) => {
    //         if (itemData.eventRegistrationUrl) {
    //             $w("#buttonRegister").expand();
    //         } else {
    //             $w("#buttonRegister").collapse();
    //         }
    //     });

    // });

    $w("#datasetEvents").onReady(() => {
        $w("#repeaterEvents").onItemReady(async ($item, itemData, index) => {
            //let redirectUrl = itemData.redirectUrl;
            let isSpecial = itemData.isSpecial;

            //collapse date&time&location if Special
            if (isSpecial) {
                $item("#textEventTime").hide()
                $item("#textEventDate").hide()
                $item("#textEventLocation").hide()
            } else {
                $item("#textEventTime").show()
                $item("#textEventDate").show()
                $item("#textEventLocation").show()
            }
        })
    });

    // only show volunteer button if form link exists in database
    $w("#repeaterServe").onItemReady(($w, itemData, index) => {
        if (itemData.serveForm) {
            $w("#buttonVolunteer").enable();
            $w("#buttonVolunteer").show();
        } else {
            $w("#buttonVolunteer").disable();
            $w("#buttonVolunteer").hide();
        }

    })
})

/*
//Toggle the description
export function buttonDescription_click(event) {
    if ($w("#descriptionFull").collapsed) {
        $w("#descriptionFull").expand();
        $w("#descriptionShort").collapse();
        $w("#vectorArrowB").show();
        $w("#vectorArrowA").hide();
        //$w("#buttonDescExpand").label = "Hide description";
    } else {
        $w("#descriptionFull").collapse();
        $w("#descriptionShort").expand();
        $w("#vectorArrowB").hide();
        $w("#vectorArrowA").show();
        //$w("#buttonDescExpand").label = "Show description";
    }
}
*/

/*
async function cacheServiceOpportunities() {
    //Get all Items
    const { items } = await wixData.query('Ministries').include('serviceOpportunities').find();
    //console.log(items);

    //Store just the item IDs and service opportunities in cache.
    items.forEach(item => { memory.setItem(item._id, JSON.stringify(item.serviceOpportunities)) });
    memory.setItem("cache-loaded", "true");
}
*/

export function imagePlayVideo_click(event) {
    $w("#imagePlayVideo").collapse();
    $w("#videoPlayer1").expand();
    $w("#videoPlayer1").play();
}

export function videoPlayer1_ended(event) {
    $w("#imagePlayVideo").expand();
    $w("#videoPlayer1").collapse();
}

