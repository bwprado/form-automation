// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixSite from 'wix-site';
import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Prefetch
    let response = wixSite.prefetchPageResources({
        "pages": ["/boulevard-kids-east", "/campus-west-murfreesboro", "/new-home"]
    });

    if (response.errors) {
        // handle errors
    }

    // Dropdown Navigation
    $w("#dropdownCampus").onChange((event) => {
        let dropdownurl = $w('#dropdownCampus').value;
        wixLocation.to(dropdownurl);
    });

    // Staff emails
    $w("#repeater5Staff").onItemReady(($item, itemData, index) => {
        $item("#button5Contact").link = "mailto:" + itemData.staffEmail + "?subject=East Campus";
        // Staff Contact Button
        if (itemData.staffEmail) {
            $item("#button5Contact").show();
        } else {
            $item("#button5Contact").hide();
        }
    });

    //filter past Event Dates & Campus
    var today = new Date();
    $w('#datasetEvents').setFilter(wixData.filter()
            .ge('eventStartDate', today)
            .hasSome('eventAssociatedCampuses', ["9cf1b820-8a76-436d-b61c-c26346e98da5"])
            .ne('eventIsHidden', true)
            .ne('ministrySpecificEvent', true)

        )
        .then(() => {
            // No Events Message
            errorTextResult();

        });

    // No Event Repeater Results
    function errorTextResult() {
        $w("#datasetEvents").onReady(() => {
            let count = $w("#datasetEvents").getTotalCount();

            if (count > 0) {
                $w('#sectionEvents').expand();
                $w('#noResText').hide();
            }
            if (count === 0) {
                $w('#sectionEvents').collapse();
                $w('#noResText').show();
            }
        });
    }

/*
    $w("#repeaterEvents").onItemReady(async ($item, itemData, index) => {
        let redirectUrl = itemData.redirectUrl;

        // redirect from dynamic event page to another page
        if (redirectUrl) {
            $item("#buttonEvent").link = redirectUrl;
            $item("#buttonEvent").target = "_self";
        } else {
            $item("#buttonEvent").link;
        }

    });
*/
});

// What to Expect
export function buttonWorship_click(event) {
    $w('#buttonWorship').disable();
    $w('#buttonChildren').enable();
    $w('#buttonYouth').enable();
    $w('#buttonAdults').enable();
    $w('#multiStateWhat').changeState("stateA");
}

export function buttonChildren_click(event) {
    $w('#buttonWorship').enable();
    $w('#buttonChildren').disable();
    $w('#buttonYouth').enable();
    $w('#buttonAdults').enable();
    $w('#multiStateWhat').changeState("stateB");
}

export function buttonYouth_click(event) {
    $w('#buttonWorship').enable();
    $w('#buttonChildren').enable();
    $w('#buttonYouth').disable();
    $w('#buttonAdults').enable();
    $w('#multiStateWhat').changeState("stateC");
}

export function buttonAdults_click(event) {
    $w('#buttonWorship').enable();
    $w('#buttonChildren').enable();
    $w('#buttonYouth').enable();
    $w('#buttonAdults').disable();
    $w('#multiStateWhat').changeState("stateD");
}

// What to Expect OLD
/*
export function buttonWorship_click(event) {
    $w('#buttonWorship').hide();
    $w('#buttonWorshipSelected').show();
    $w('#buttonChildren').show();
    $w('#buttonChildrenSelected').hide();
    $w('#buttonYouth').show();
    $w('#buttonYouthSelected').hide();
    $w('#buttonAdults').show();
    $w('#buttonAdultsSelected').hide();
    $w('#boxWorship').expand();
    $w('#boxChildren').collapse();
    $w('#boxYouth').collapse();
    $w('#boxAdults').collapse();
}

export function buttonChildren_click(event) {
    $w('#buttonWorship').show();
    $w('#buttonWorshipSelected').hide();
    $w('#buttonChildren').hide();
    $w('#buttonChildrenSelected').show();
    $w('#buttonYouth').show();
    $w('#buttonYouthSelected').hide();
    $w('#buttonAdults').show();
    $w('#buttonAdultsSelected').hide();
    $w('#boxWorship').collapse();
    $w('#boxChildren').expand();
    $w('#boxYouth').collapse();
    $w('#boxAdults').collapse();
}

export function buttonYouth_click(event) {
    $w('#buttonWorship').show();
    $w('#buttonWorshipSelected').hide();
    $w('#buttonChildren').show();
    $w('#buttonChildrenSelected').hide();
    $w('#buttonYouth').hide();
    $w('#buttonYouthSelected').show();
    $w('#buttonAdults').show();
    $w('#buttonAdultsSelected').hide();
    $w('#boxWorship').collapse();
    $w('#boxChildren').collapse();
    $w('#boxYouth').expand();
    $w('#boxAdults').collapse();
}

export function buttonAdults_click(event) {
    $w('#buttonWorship').show();
    $w('#buttonWorshipSelected').hide();
    $w('#buttonChildren').show();
    $w('#buttonChildrenSelected').hide();
    $w('#buttonYouth').show();
    $w('#buttonYouthSelected').hide();
    $w('#buttonAdults').hide();
    $w('#buttonAdultsSelected').show();
    $w('#boxWorship').collapse();
    $w('#boxChildren').collapse();
    $w('#boxYouth').collapse();
    $w('#boxAdults').expand();
}
*/