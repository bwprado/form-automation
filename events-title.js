$w.onReady(() => {
  /** @type {Intl.DateTimeFormatOptions} */
  const optionStart = {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
    //year: "numeric"
  }

  /** @type {Intl.DateTimeFormatOptions} */
  const optionEnd = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }

  $w('#dynamicDataset').onReady(() => {
    /** @type {import('public/types').Event} */
    let item = $w('#dynamicDataset').getCurrentItem()

    const startDate = item.eventStartDate
    const endDate = item.eventEndDate

    $w('#textDateStart').text = startDate.toLocaleDateString(
      'en-US',
      optionStart
    )
    $w('#textDateEnd').text = endDate.toLocaleDateString('en-US', optionEnd)

    $w('#buttonRegister')[item.eventRegistrationUrl ? 'show' : 'hide']()

    $w('#buttonRegister').label = item.buttonALabel || 'Register'

    $w('#boxWhenAndWhere')[item.isSimple ? 'collapse' : 'expand']()

    let eventVideo = item?.eventVideo
    let videoUrl = item?.eventVideo

    $w('#boxCoverVideo')[eventVideo === undefined ? 'show' : 'hide']()
    $w('#videoPlayer1')[eventVideo === undefined ? 'hide' : 'show']()

    $w('#videoPlayer1').src = videoUrl
  })

  $w('#datasetMinistries').onReady(() => {
    $w('#repeaterMinistries').onItemReady(async ($item, itemData, index) => {
      let ministryUrl = itemData.ministryUrl

      if (ministryUrl) {
        $item('#imageMinistry').link = ministryUrl
      } else {
        $item('#imageMinistry').link
      }
    })
  })

  $w('#datasetServe').onReady(() => {
    $w('#repeaterServing').onItemReady(async ($item, itemData, index) => {
      $item('#buttonVolunteer')[itemData.serveForm ? 'show' : 'hide']()
    })
  })
})
