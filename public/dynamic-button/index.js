import wixData from 'wix-data'

/**
 * @function getCurrentSeasonInfo
 * @param {Date} date - The current date object
 * @return {Promise<import('public/types').Season>} The current season
 */
export const getCurrentSeasonInfo = async (date) => {
  try {
    const { items } = await wixData.query('ClassesSeason').find()
    const seasons = items[0]?.seasons || []

    if (!seasons.length) return null

    const currentSeason = seasons.find(
      (season) =>
        date >= new Date(season.startDate) && date <= new Date(season.endDate)
    )

    return currentSeason || null
  } catch (error) {
    console.error(error)
    return null
  }
}
