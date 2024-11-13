import wixData from 'wix-data'

$w.onReady(async function () {
  noServe()

  let response = wixSite.prefetchPageResources({
    pages: ['/ministries']
  })

  if (response.errors) {
    console.error(response.errors)
  }

  $w('#repeaterStaff').onItemReady(($item, itemData) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.email + '?subject=boulevard WOMEN'
    $item('#buttonContact')[itemData.email ? 'show' : 'hide']()
  })

  $w('#repeater1').onItemReady(($w, itemData) => {
    let buttonUrl = itemData.actionButtonUrl
    $w('#buttonAction').link = buttonUrl
    $w('#buttonWatch')[itemData.classPage ? 'expand' : 'collapse']()
    $w('#buttonAction')[itemData.actionButtonUrl ? 'expand' : 'collapse']()
  })

  const today = new Date()
  await $w('#datasetEvents').setFilter(
    wixData
      .filter()
      .ge('eventEndDate', today)
      .hasSome('eventMinistries', ['c9304001-0699-4b73-a586-83c84b1a9f64'])
      .ne('eventIsHidden', true)
  )
  errorTextResult()

  $w('#datasetEvents').onReady(() => {
    $w('#repeaterEvents').onItemReady(async ($item, itemData) => {
      $item('#boxDateAndTime, #textEventLocation')[
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
