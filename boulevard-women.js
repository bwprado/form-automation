// For full API documentation, including code examples, visit https://wix.to/94BuAAs

import wixLocation from 'wix-location'
import wixSite from 'wix-site'
import wixData from 'wix-data'

$w.onReady(function () {
  noServe()

  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ['/ministries']
  })

  if (response.errors) {
    // handle errors
  }

  // Staff Emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.email + '?subject=boulevard WOMEN'
    // Staff Contact Button
    if (itemData.email) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })

  /*
        // Campus Dropdown
        $w("#dropdownCampus").onChange((event) => {
            let dropdownurl = $w('#dropdownCampus').value;
            wixLocation.to(dropdownurl);
        });
    */

  //filter past Event Dates & Campus
  var today = new Date()
  $w('#datasetEvents')
    .setFilter(
      wixData
        .filter()
        .ge('eventEndDate', today)
        .hasSome('eventMinistries', ['c9304001-0699-4b73-a586-83c84b1a9f64'])
        .ne('eventIsHidden', true)
    )
    .then(() => {
      // No Events Message
      errorTextResult()
    })

  $w('#datasetEvents').onReady(() => {
    $w('#repeaterEvents').onItemReady(async ($item, itemData, index) => {
      //let redirectUrl = itemData.redirectUrl;
      let isSpecial = itemData.isSpecial

      //collapse date&time&location if Special
      if (isSpecial) {
        $item('#textEventTime').hide()
        $item('#textEventDate').hide()
        $item('#textEventLocation').hide()
      } else {
        $item('#textEventTime').show()
        $item('#textEventDate').show()
        $item('#textEventLocation').show()
      }
    })
  })

  // No Event Repeater Results
  function errorTextResult() {
    $w('#datasetEvents').onReady(() => {
      let count = $w('#datasetEvents').getTotalCount()

      if (count > 0) {
        $w('#sectionEvents').expand()
      }
      if (count === 0) {
        $w('#sectionEvents').collapse()
      }
    })
  }

  // No Opportunities Repeater Results
  function noServe() {
    $w('#datasetServe').onReady(() => {
      let count = $w('#datasetServe').getTotalCount()

      if (count > 0) {
        $w('#sectionOpportunities').expand()
      }
      if (count === 0) {
        $w('#sectionOpportunities').collapse()
      }
    })
  }
})
