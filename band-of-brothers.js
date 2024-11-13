import wixData from 'wix-data'

$w.onReady(async function () {
  noServe()

  let response = wixSite.prefetchPageResources({
    pages: ['/ministries']
  })

  if (response.errors) {
    console.error(response.errors)
  }

  // Staff Emails
  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.email + '?subject=boulevard MEN'
    // Staff Contact Button
    $item('#buttonContact')[itemData.email ? 'show' : 'hide']()
  })

  //Classes repeater
  $w('#repeater1').onItemReady(($w, itemData, index) => {
    let buttonUrl = itemData.actionButtonUrl
    $w('#buttonAction').link = buttonUrl
    $w('#buttonWatch')[itemData.classPage ? 'expand' : 'collapse']()
    $w('#buttonAction')[itemData.actionButtonUrl ? 'expand' : 'collapse']()
  })

  //filter past Event Dates & Campus
  var today = new Date()
  await $w('#datasetEvents').setFilter(
    wixData
      .filter()
      .ge('eventEndDate', today)
      .hasSome('eventMinistries', ['5e14614e-1176-40b6-b9f3-a4e754859915'])
      .ne('eventIsHidden', true)
  )
  errorTextResult()

  $w('#datasetEvents').onReady(() => {
    $w('#repeaterEvents').onItemReady(async ($item, itemData) => {
      $item('#boxDateAndTime,  #textEventLocation')[
        itemData?.isSimple ? 'hide' : 'show'
      ]()
    })
  })

  // No Event Repeater Results
  function errorTextResult() {
    $w('#datasetEvents').onReady(() => {
      let count = $w('#datasetEvents').getTotalCount()

      $w('#sectionEvents')[count > 0 ? 'expand' : 'collapse']()
    })
  }

  // No Opportunities Repeater Results
  function noServe() {
    $w('#datasetServe').onReady(() => {
      let count = $w('#datasetServe').getTotalCount()

      $w('#sectionOpportunities')[count > 0 ? 'expand' : 'collapse']()
    })
  }
})
