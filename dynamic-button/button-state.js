import { observable } from 'mobx'

export const state = observable({
  label: '',
  href: '',
  firstQuarter: {
    startDate: null,
    endDate: null
  },
  secondQuarter: {
    startDate: null,
    endDate: null
  },
  thirdQuarter: {
    startDate: null,
    endDate: null
  },
  fourthQuarter: {
    startDate: null,
    endDate: null
  },
  /**
   * @method setLabel - Sets the label of the button
   * @param {string} label - The label of the button
   */
  setLabel(label) {
    this.label = label
  },
  /**
   * @method setHref - Sets the URL to link to
   * @param {string} href - The URL to link to
   */
  setHref(href) {
    this.href = href
  },
  /**
   * @method setFirstQuarter - Sets the dates for the first Quarter
   * @param {Date} startDate - The start date of the first quarter
   * @param {Date} endDate - The end date of the first quarter
   */
  setFirstQuarter(startDate, endDate) {
    this.firstQuarter.startDate = startDate
    this.firstQuarter.endDate = endDate
  },
  /**
   * @method setSecondQuarter - Sets the dates for the second Quarter
   * @param {Date} startDate - The start date of the second quarter
   * @param {Date} endDate - The end date of the second quarter
   */
  setSecondQuarter(startDate, endDate) {
    this.secondQuarter.startDate = startDate
    this.secondQuarter.endDate = endDate
  },
  /**
   * @method setThirdQuarter - Sets the dates for the third Quarter
   * @param {Date} startDate - The start date of the third quarter
   * @param {Date} endDate - The end date of the third quarter
   */
  setThirdQuarter(startDate, endDate) {
    this.thirdQuarter.startDate = startDate
    this.thirdQuarter.endDate = endDate
  },
  /**
   * @method setFourthQuarter - Sets the dates for the fourth Quarter
   * @param {Date} startDate - The start date of the fourth quarter
   * @param {Date} endDate - The end date of the fourth quarter
   */
  setFourthQuarter(startDate, endDate) {
    this.fourthQuarter.startDate = startDate
    this.fourthQuarter.endDate = endDate
  }
})
