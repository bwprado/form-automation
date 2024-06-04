// For full API documentation, including code examples, visit https://wix.to/94BuAAs

import wixLocation from 'wix-location';
import wixSite from 'wix-site';
import wixData from "wix-data";

$w.onReady(function () {
	// Prefetch
    let response = wixSite.prefetchPageResources({
        "pages": ["/nbyg-east"]
    });

    if (response.errors) {
        // handle errors
    }

	// Staff Emails
	$w("#repeaterStaff").onItemReady(($item, itemData, index) => {
		$item("#buttonContact").link = "mailto:" + itemData.email + "?subject=nbyg West";
        // Staff Contact Button
        if (itemData.email) {
                $item("#buttonContact").show();
            } else {
                $item("#buttonContact").hide();
            }
	});

	// Campus Dropdown
    $w("#dropdownCampus").onChange((event) => {
        let dropdownurl = $w('#dropdownCampus').value;
        wixLocation.to(dropdownurl);
    });

    //filter past Event Dates & Campus
    var today = new Date();
    $w('#datasetEvents').setFilter(wixData.filter()
            .ge('eventStartDate', today)
            .hasSome('eventMinistries', ["ca34818d-3deb-4c1d-9a16-9fe6b0e4bf5a"])
            .ne('eventIsHidden', true)
            
        )
        .then(() => {
            // No Events Message
            errorTextResult();

        });

    // No Repeater Results
    function errorTextResult() {
        $w("#datasetEvents").onReady(() => {
            let count = $w("#datasetEvents").getTotalCount();

            if (count > 0) {
                $w('#noResText').hide();
                $w('#sectionEvents').expand();

            }
            if (count === 0) {
                $w('#noResText').show();
                $w('#sectionEvents').collapse();
            }
        });
    }
});
