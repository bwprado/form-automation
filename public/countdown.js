import { isValidHttpUrl } from '@derrellchristopher/validator-utils'
/**
 * @fileoverview - This is an adapter for the native Wix Elements within EditorX, since blocks isn't working.
 */

/** Class that represents a countdown element. */

export default class Countdown {
  _title = 'Next Live Stream'

  /**@type {Date} The date & time until the countdown is finished */
  _targetDate = Countdown.nextTargetDate(0)

  /**@type {Date} The date & time until the countdown is finished */
  _restartDate = new Date('1/1/3000')

  /**@type {Number} The duration for which the timer will last, in minutes*/
  _duration = -1

  /**Target link */
  _targetLink = 'online'

  /**@type {boolean} - Whether the  Countdown is currently running. */
  _isCounting

  distance
  timeLeft
  thisInterval = null

  _countdownElements = {
    /** @type {$w.Text} - The Days Countdown inner Text Element */
    daysText: null,
    /** @type {$w.Text} hoursText - The Hours Countdown Number Element*/
    hoursText: null,
    /** @type {$w.Text} minutesText - The Minutes Countdown Number Element */
    minutesText: null,
    /**@type {$w.Text} secondsText - The Seconds Countdown Number Element */
    secondsText: null
  }

  /** Default values for computation of time*/
  static _second = 1000
  static _minute = Countdown._second * 60
  static _hour = Countdown._minute * 60
  static _day = Countdown._hour * 24

  /**
   * Create a new countdown
   * @param {Object} countdownElements - The Days Countdown Number
   * @param {$w.Text} countdownElements.daysText - The Days Countdown Text Element
   * @param {$w.Text} countdownElements.hoursText - The Hours Countdown Number Element
   * @param {$w.Text} countdownElements.minutesText - The Minutes Countdown Number Element
   * @param {$w.Text} countdownElements.secondsText - The Seconds Countdown Number Element
   * @param {$w.Text} titleText - The element representing the Countdown's title
   * @param {$w.Image}logo  - The element representing the logo added.
   * @param {$w.Text} timerExpiredText - The element representing the timer completed message
   * @param {Date=} [targetDate] - The target date & time for the countdown. If none is set, the code will automatically run until the next Sunday at 10 AM.
   * @param {Number} duration - The length of the timer.
   */
  constructor(
    countdownElements,
    titleText,
    timerExpiredText,
    logo,
    targetDate = null,
    duration = 60
  ) {
    // super();
    /**Set Default Value when first loaded */
    if (countdownElements) {
      const { daysText, hoursText, minutesText, secondsText } =
        countdownElements
      this._countdownElements = {
        daysText,
        hoursText,
        minutesText,
        secondsText
      }
    }
    Object.values(countdownElements).forEach(
      (TextElem) => (TextElem.text = '-')
    )
    if (!(targetDate instanceof Date)) {
      //Nothing is set
      this._targetDate = Countdown.nextTargetDate(0)
      this._restartDate = Countdown.nextRestartDate(0)
      this._duration = 55 //55 minutes by default
    } else {
      //The deadline has been explicitly passed to the constructor
      this._targetDate = targetDate
      this._duration = duration || 60
      this._restartDate = Countdown.addMinutesToDate(
        this.targetDate,
        duration || 60
      )
    }

    this.container = titleText.parent
    this.titleText = titleText
    this.logo = logo
    this.timerExpiredText = timerExpiredText
    this.titleText.text = this._title
    //this.timerExpiredText.html = `<h2>We're Live Now, <a href="/${this._targetLink}">Join Us!</a></h2>`;
    this.timerExpiredText.text = `We're Live Now, Join Us!`
  }

  /**
   * Set the date on which this timer should end
   * @param {Date} date
   */
  set targetDate(date) {
    if (date instanceof Date && date > new Date()) {
      this._targetDate = date
    }
  }
  /**
   * Set the date on which this timer should restart, if any
   * @param {Date} date
   */
  set restartDate(date) {
    if (date instanceof Date && date > new Date()) {
      this._restartDate = date
    } else {
      throw new Error('Invalid date')
    }
  }
  /**
   * Set the date on which this timer should restart, if any
   * @param {Number} minutes - This is the non-zero value of the duration for the countdown.
   */
  set duration(minutes) {
    if (minutes < 1 || minutes > 1440) {
      throw new RangeError(
        'This duration must be between 1 minute and 1440 minutes (1 day), inclusive.'
      )
    } else if (isNaN(minutes)) {
      throw new TypeError('Provide a valid number.')
    }
    this._duration = minutes
    this._restartDate = Countdown.addMinutesToDate(this.targetDate, minutes)
  }

  /**
   * @param {string} title - The title of the countdown.
   */
  set title(title) {
    this._title = title
    if (this.titleText) this.titleText.text = this._title
  }

  set targetLink(link) {
    //Link check for valid link.
    if (isValidHttpUrl(link)) this._targetLink = link
  }

  get targetDate() {
    return this._targetDate
  }

  get restartDate() {
    return this._restartDate
  }

  /**
   * @returns {Number} The number of minutes that the timer should last for. If it is not set, it will be -1.
   */
  get duration() {
    return this._duration
  }
  get title() {
    return this._title
  }
  get isCounting() {
    return this._isCounting
  }
  /**
   * @returns {String} The Target Link. It may be a full external link or a local relative path;
   */
  get targetLink() {
    return this._targetLink
  }

  /**
   * Start Countdown. Main function of the countdown.
   * @returns {boolean}
   */
  startCountdown() {
    if (!this._targetDate) this._errorHandler('Set a target Date')

    try {
      this.calculateTimeToDate()
      this._isCounting = true
      return true
    } catch (err) {
      console.error(err)
      this._errorHandler(err)
      return false
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // Auxiliary Functions
  ///////////////////////////////////////////////////////////////////////

  calculateTimeToDate() {
    this.thisInterval = setInterval(() => {
      const now = new Date().getTime()
      //If there is an endDate set, either explicitly by William on the element via Set Attributes, or through the admin panel, then it will take that as the end date.

      //Setting second strategy. U
      this.distance = this._targetDate.getTime() - now

      //TODO  if the countdown has passed on, move onto the next available Sunday date
      if (this._restartDate.getTime() < now) {
        this._targetDate = Countdown.nextTargetDate(0)
        this._restartDate = Countdown.nextRestartDate(0)
        this.calculateTimeToDate()
      } else if (
        this._restartDate.getTime() <= this._targetDate.getTime() ||
        this._targetDate.getTime() < now
      ) {
        //In that sweet spot to show the event
        this.titleText.text = `We're Live Now`
        //this.timerExpiredText.html = `<h2>We're Live Now, <a href="/${this._targetLink}">Join Us!</a></h2>`;
        this.timerExpiredText.text = `We're Live Now, Join Us!`

        this.timerExpiredText.expand()
        this.logo.expand()
        Object.values(this._countdownElements).forEach((i) =>
          i.parent.collapse()
        )
        this.titleText.collapse()
        clearInterval(this.thisInterval)
        this._isCounting = false
        return
      } else {
        //Any other case means that we haven't reached the deadline... This doesn't make sense.

        this._countdownElements.daysText.text = Math.floor(
          this.distance / Countdown._day
        ).toString()
        this._countdownElements.hoursText.text = Math.floor(
          (this.distance % Countdown._day) / Countdown._hour
        ).toString()
        this._countdownElements.minutesText.text = Math.floor(
          (this.distance % Countdown._hour) / Countdown._minute
        ).toString()
        this._countdownElements.secondsText.text = Math.floor(
          (this.distance % Countdown._minute) / Countdown._second
        ).toString()
      }
    }, 1000)
  }
  /**
   * Takes dayIndex from sunday(0) to saturday(6)and returns 10:20 AM on that day
   * @param {Number} dayIndex - A day from 0 to 6 (Sunday to Saturday)
   */
  static nextTargetDate(dayIndex) {
    let today = new Date()

    today.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7))
    today.setHours(10, 20, 0, 0)
    if (today <= new Date()) today.setDate(today.getDate() + 7) //Add a week if it's today!
    return today
  }

  static nextRestartDate(dayIndex) {
    let today = new Date()

    today.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7))
    today.setHours(11, 15, 0, 0) //Sets the time to restart as 11:15 AM.
    if (today <= new Date()) today.setDate(today.getDate() + 7) //Add a week if it's today!
    return today
  }

  /**
   * @param {Date} date - The date to add minutes to.
   * @param {Number} minutes - The number of minutes to be added.
   */
  static addMinutesToDate(date, minutes) {
    if (!date || !(date instanceof Date)) {
      throw new TypeError('Please provide a valid date for the function')
    }
    if (!isNaN(minutes)) {
      return new Date(date.getTime() + minutes * 60000)
    }
  }
  /**
   * Handler all errors throughout the class
   * @param {*} err - The error being handled.
   */
  _errorHandler(err) {
    console.error(err)
    throw Error(err)
  }
}
