// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data';
import wixSite from 'wix-site';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // Prefetch
    let response = wixSite.prefetchPageResources({
        "pages": ["/campus-east-murfreesboro", "/campus-west-murfreesboro", "/campus-iglesia-de-cristo", "/new-home"]
    });

    if (response.errors) {
        // handle errors
    }

    // RESOURCES color control
    $w("#repeaterResource").onItemReady(adjustResourceItem);


    // Dropdown Navigation
    $w("#dropdownCampus").onChange((event) => {
        let dropdownurl = $w('#dropdownCampus').value;
        wixLocation.to(dropdownurl);
    });


 //filter past Event Dates & Campus
  var today = new Date();
  $w('#datasetEvents').setFilter(wixData.filter()
          .ge('eventStartDate', today)
          .hasSome('eventAssociatedCampuses', ["13fc12c0-c59a-4ad4-acfd-01a459f0d7e0"])
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
                $w('#sectionEvents').expand();

            }
            if (count === 0) {
                $w('#sectionEvents').collapse();
            }
        });
    }


    //Staff emails
    $w("#repeaterStaff").onItemReady(($item, itemData, index) => {
        $item("#buttonContact").link = "mailto:" + itemData.staffEmail + "?subject=MT316";
        // Staff Contact Button
        if (itemData.staffEmail) {
            $item("#buttonContact").show();
        } else {
            $item("#buttonContact").hide();
        }
    });



});

// Used to adjust the colors of the resource Type tiles in the repeater
function adjustResourceItem($item, itemData, index) {
    if (itemData.resourceColor) {
        $item("#itemResource").style.backgroundColor = itemData.resourceColor;
    } else {
        $item("#itemResource").style.backgroundColor = "#36424a";
    }
}