// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
import wixSite from 'wix-site';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Prefetch
    let response = wixSite.prefetchPageResources({
        "pages": ["/boulevard-kids-west", "/nbyg-west"]
    });

    if (response.errors) {
        // handle errors
    }

    // Dropdown Navigation
    $w("#dropdownCampus").onChange((event) => {
        let dropdownurl = $w('#dropdownCampus').value;
        wixLocation.to(dropdownurl);
    });

    // RESOURCES color control
    $w("#repeaterResource").onItemReady(adjustResourceItem);

    // Staff Contact Emails
    $w("#repeaterStaff").onItemReady(($item, itemData, index) => {
        $item("#buttonContact").link = "mailto:" + itemData.staffEmail + "?subject=West Campus";
        // Staff Contact Button
        if (itemData.staffEmail) {
            $item("#buttonContact").show();
        } else {
            $item("#buttonContact").hide();
        }
    });

    //filter past Event Dates & Campus
    var today = new Date();
    $w('#datasetEvents').setFilter(wixData.filter()
            .ge('eventStartDate', today)
            .hasSome('eventAssociatedCampuses', ["ede394da-93a1-4b61-b59f-c81453e557d1"])
            .ne('eventIsHidden', true)

        )
        .then(() => {
            // No Events Message
            errorTextResult();

        });

    // No Events Repeater Results
    function errorTextResult() {
        $w("#datasetEvents").onReady(() => {
            let count = $w("#datasetEvents").getTotalCount();

            if (count > 0) {
                $w('#noResText').hide();

            }
            if (count === 0) {
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


// Used to adjust the colors of the resource Type tiles in the repeater
function adjustResourceItem($item, itemData, index) {
    if (itemData.resourceColor) {
        $item("#itemResource").style.backgroundColor = itemData.resourceColor;
    } else {
        $item("#itemResource").style.backgroundColor = "#36424a";
    }
}

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