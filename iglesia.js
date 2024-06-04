// For full API documentation, including code examples, visit https://wix.to/94BuAAs
import wixData from 'wix-data'
import wixLocation from 'wix-location'

$w.onReady(function () {
  // Dropdown Navigation
  $w('#dropdownCampus').onChange((event) => {
    let dropdownurl = $w('#dropdownCampus').value
    wixLocation.to(dropdownurl)
  })

  // Staff emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.staffEmail + '?subject=Hola!'
    // Staff Contact Button
    if (itemData.staffEmail) {
      $item('#buttonContact').show()
    } else {
      $item('#buttonContact').hide()
    }
  })

  //filter past Event Dates & Campus
  var today = new Date()
  $w('#datasetEvents')
    .setFilter(
      wixData
        .filter()
        .ge('eventStartDate', today)
        .hasSome('eventAssociatedCampuses', [
          '57c7dc4b-28bd-4718-ab44-f628c38cff4d'
        ])
        .ne('eventIsHidden', true)
        .ne('ministrySpecificEvent', true)
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
        $w('#sectionEvents').expand()
        $w('#noResText').hide()
      }
      if (count === 0) {
        $w('#sectionEvents').collapse()
        $w('#noResText').show()
      }
    })
  }
})

// What to Expect
export function buttonWorship_click(event) {
  $w('#buttonWorship').hide()
  $w('#buttonWorshipSelected').show()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').expand()
  $w('#boxChildren').collapse()
  $w('#boxYouth').collapse()
  $w('#boxAdults').collapse()
}

export function buttonChildren_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').hide()
  $w('#buttonChildrenSelected').show()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').collapse()
  $w('#boxChildren').expand()
  $w('#boxYouth').collapse()
  $w('#boxAdults').collapse()
}

export function buttonYouth_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').hide()
  $w('#buttonYouthSelected').show()
  $w('#buttonAdults').show()
  $w('#buttonAdultsSelected').hide()
  $w('#boxWorship').collapse()
  $w('#boxChildren').collapse()
  $w('#boxYouth').expand()
  $w('#boxAdults').collapse()
}

export function buttonAdults_click(event) {
  $w('#buttonWorship').show()
  $w('#buttonWorshipSelected').hide()
  $w('#buttonChildren').show()
  $w('#buttonChildrenSelected').hide()
  $w('#buttonYouth').show()
  $w('#buttonYouthSelected').hide()
  $w('#buttonAdults').hide()
  $w('#buttonAdultsSelected').show()
  $w('#boxWorship').collapse()
  $w('#boxChildren').collapse()
  $w('#boxYouth').collapse()
  $w('#boxAdults').expand()
}
