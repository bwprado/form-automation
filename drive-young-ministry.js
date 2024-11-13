import wixSite from 'wix-site'
import wixData from 'wix-data'

$w.onReady(async function () {
  noServe()

  // Prefetch
  let response = wixSite.prefetchPageResources({
    pages: ['/ministries']
  })

  if (response.errors) {
    console.error(response.errors)
  }

  $w('#repeaterStaff').onItemReady(($item, itemData, index) => {
    $item('#buttonContact').link =
      'mailto:' + itemData.email + '?subject=Young Adult Ministry'
    $item('#buttonContact')[itemData.email ? 'show' : 'hide']()
  })

  $w('#repeater1').onItemReady(($w, itemData, index) => {
    let buttonUrl = itemData.actionButtonUrl
    $w('#buttonAction').link = buttonUrl

    $w('#buttonAction')[itemData.classPage ? 'expand' : 'collapse']()
    $w('#buttonAction')[itemData.actionButtonUrl ? 'expand' : 'collapse']()
  })

  const today = new Date()
  await $w('#datasetEvents').setFilter(
    wixData
      .filter()
      .ge('eventEndDate', today)
      .hasSome('eventMinistries', ['8df4de8b-4a7a-4d87-a356-a96613918d5b'])
      .ne('eventIsHidden', true)
  )
  errorTextResult()

  $w('#datasetEvents').onReady(() => {
    $w('#repeaterEvents').onItemReady(async ($item, itemData, index) => {
      $item('#boxDateAndTime, #textEventLocation')[
        itemData?.isSimple ? 'hide' : 'show'
      ]()
    })
  })

  // No Event Repeater Results
  function errorTextResult() {
    $w('#datasetEvents').onReady(() => {
      const count = $w('#datasetEvents').getTotalCount()

      $w('#sectionEvents')[count > 0 ? 'expand' : 'collapse']()
    })
  }

  // No Opportunities Repeater Results
  function noServe() {
    $w('#datasetServe').onReady(() => {
      const count = $w('#datasetServe').getTotalCount()

      $w('#sectionOpportunities')[count > 0 ? 'expand' : 'collapse']()
    })
  }
})
