import wixLocation from 'wix-location'
import wixSite from 'wix-site'
import wixData from 'wix-data'

$w.onReady(function () {
  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ['/nbyg-west']
  })

  if (response.errors) {
    // handle errors
  }

  // Staff Emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=nbyg'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })

  // Campus Dropdown
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  //filter past Event Dates & Campus
  var today = new Date()
  $w('#datasetEvents')
    .setFilter(
      wixData
        .filter()
        .ge('eventEndDate', today)
        .hasSome('eventMinistries', ['0eadd645-9354-4b52-a98d-1ae91f181eea'])
        .ne('eventIsHidden', true)
    )
    .then(() => {
      // No Events Message
      errorTextResult()
    })

  // No Event Repeater Results
  function errorTextResult() {
    $w('#datasetEvents').onReady(() => {
      let count = $w('#datasetEvents').getTotalCount()

      if (count > 0) {
        $w('#noResText').hide()
        $w('#sectionEvents').expand()
      }
      if (count === 0) {
        $w('#noResText').show()
        $w('#sectionEvents').collapse()
      }
    })
  }
})
