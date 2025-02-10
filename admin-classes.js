import wixData from 'wix-data'
import { format, parseISO } from 'date-fns'

/**
 * @typedef {import('public/types').Season} Season
 */

/**
 * @function formatDates
 * @description Format the dates for the repeater
 * @param {string | Date} date
 */
const formatDates = (date) => {
  if (!date) return ''
  if (date instanceof Date) {
    return format(date, 'MM/dd/yyyy')
  }
  if (typeof date === 'string') {
    return format(parseISO(date), 'MM/dd/yyyy')
  }
}

/**
 * @function handleSaveSeasons
 * @description Save the seasons to the database
 * @param {Season[]} seasons
 */
const handleSaveSeasons = async (seasons) => {
  $w('#btnSaveSeasons').disable()
  try {
    const res = await wixData.update('ClassesSeason', { seasons })
    console.log('Seasons updated', res)
  } catch (error) {
    console.error(error)
  }
  $w('#btnSaveSeasons').enable()
}

/**
 * @function handleAddSeason
 * @description Add a new season to the repeater
 * @returns {void}
 */
const handleAddSeason = () => {
  const seasons = $w('#rptSeasons').data
  const newSeason = {
    _id: crypto.randomUUID(),
    label: $w('#iptLabel').value,
    startDate: $w('#startDate').value,
    endDate: $w('#endDate').value,
    href: $w('#iptHref').value
  }

  if (newSeason.startDate > newSeason.endDate) {
    $w('#txtError').text = 'Start date must be before end date'
    $w('#txtError').show()
    return
  } else {
    $w('#txtError').text = ''
    $w('#txtError').hide()
  }

  const hasOverlap = seasons.some((season) => {
    const seasonStart = new Date(season.startDate)
    const seasonEnd = new Date(season.endDate)
    const newStart = new Date(newSeason.startDate)
    const newEnd = new Date(newSeason.endDate)

    return (
      (newStart >= seasonStart && newStart <= seasonEnd) ||
      (newEnd >= seasonStart && newEnd <= seasonEnd) ||
      (newStart <= seasonStart && newEnd >= seasonEnd)
    )
  })

  if (hasOverlap) {
    $w('#txtError').text = 'New season dates overlap with an existing season'
    $w('#txtError').show()
    return
  }

  if (!newSeason?.label || !newSeason?.link) {
    $w('#txtError').text = 'Label and link are required'
    $w('#txtError').show()
  }

  seasons.push(newSeason)

  $w('#txtError').text = ''
  $w('#txtError').hide()
  $w('#iptLabel').value = ''
  $w('#startDate').value = undefined
  $w('#endDate').value = undefined
  $w('#iptHref').value = ''

  $w('#rptSeasons').data = seasons
}

/**
 * @method handleRemoveSeason
 * @description Remove a season from the repeater
 * @param {$w.Event} e
 */
const handleRemoveSeason = (e) => {
  const newData = $w('#rptSeasons').data.filter(
    (item) => item._id !== e.context.itemId
  )
  $w('#rptSeasons').data = newData
}

/**
 * @method prepareRepeater
 * @description Prepare the repeater with the season data
 * @param {any} $item
 * @param {Season} itemData
 */
const prepareRepeater = ($item, itemData) => {
  $item('#txtLabel').text = itemData?.label || ''
  $item('#txtStartDate').text = formatDates(itemData?.startDate)
  $item('#txtEndDate').text = formatDates(itemData?.endDate)
  $item('#txtHref').text = itemData?.href || ''
}

/**
 * @function getSeasons
 * @description Get the seasons from the database
 * @returns {Promise<Season[]>}
 */
const getSeasons = async () => {
  try {
    const res = await wixData.query('ClassesSeason').find()
    return res.items[0]?.seasons || []
  } catch (error) {
    console.error(error)
  }
}

$w.onReady(async () => {
  const seasons = await getSeasons()
  $w('#rptSeasons').data = seasons
  $w('#rptSeasons').onItemReady(prepareRepeater)

  $w('#btnSaveSeasons').onClick(() => handleSaveSeasons($w('#rptSeasons').data))
  $w('#btnAddSeason').onClick(handleAddSeason)
  $w('#btnRemoveSeason').onClick(handleRemoveSeason)
})
