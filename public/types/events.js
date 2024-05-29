/**
 * @typedef {Object} Event
 * @property {string} _id
 * @property {'hidden' | 'visible'} status
 * @property {string} eventTitle
 * @property {string} eventDescription
 * @property {string} eventStartDate
 * @property {string} eventEndDate
 * @property {string} eventImageLandscape
 * @property {string} eventLocationName
 * @property {string} redirectUrl
 * @property {string[]} serviceOpportunities
 * @property {string[]} eventMinistries
 * @property {string} eventAssociatedCampuses
 * @property {string} eventVideo
 * @property {string} richDescription
 * @property {string} eventRegistrationUrl
 * @property {string} buttonALabel
 * @property {boolean} ministrySpecificEvent
 * @property {boolean} [isSpecial]
 * @property {string} link-events-eventTitle
 */

/**
 * @typedef {Object} Campuses
 * @property {string} Online
 */

/**
 * @typedef {Object} SpecialEvent
 * @property {string} subtitle
 * @property {string} promoVideoUrl
 * @property {Date} _publishDate
 * @property {string} shortTitle
 * @property {string[]} directionsButtonLabel
 * @property {string} promoText
 * @property {string} image
 * @property {string} _id
 * @property {Date} _draftDate
 * @property {string} _owner
 * @property {string} imageH2
 * @property {Date} _createdDate
 * @property {string} imageH1
 * @property {boolean} hidePlanAVisit
 * @property {string} scheduleBackgroundImage
 * @property {Date} _updatedDate
 * @property {string} scheduleTitle
 * @property {string} imageH5
 * @property {string} directionsButtonUrl
 * @property {string} promoTitle
 * @property {string} shortTitleLogo
 * @property {string} imageV2
 * @property {Date} date
 * @property {string} link-special-event-title
 * @property {string} imageH4
 * @property {string} _publishStatus
 * @property {string} eventDescriptionImage
 * @property {string} title
 * @property {boolean} hidePresentedBy
 * @property {string} headerImage
 * @property {string} eventDescriptionTitle
 * @property {string} eventDescription
 * @property {string} imageV1
 * @property {boolean} hideEvents
 * @property {string} imageH3
 * @property {string} promoDownloadUrl
 */

/**
 * @typedef {Object} SpecialEventSchedule
 * @property {string} _id
 * @property {string} _owner
 * @property {string} _createdDate
 * @property {string} scheduleDescription
 * @property {string} _updatedDate
 * @property {string} scheduleTitle
 * @property {SpecialEvent} referencedSpecialEvent
 * @property {Date} date
 * @property {string} itemBgColor
 * @property {string} time
 * @property {string} title
 */

/**
 * @typedef {Object} ParsedSpecialEvent
 * @property {string} _id
 * @property {string} eventTitle
 * @property {string} eventDescription
 * @property {string} eventImageLandscape
 * @property {Date} date
 * @property {string} link-events-eventTitle
 * @property {boolean} isSpecial
 */

export const Types = {}
