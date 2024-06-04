export const Ministries = {
  BoulevardKidsWest: '04b632be-e422-4648-afca-be5c2a468b0f',
  BoulevardKidsEast: 'b594a941-1bd9-45b6-859d-9fb59eba3433',
  BoulevardWomen: 'c9304001-0699-4b73-a586-83c84b1a9f64',
  BoulevardMen: 'f1d9a0c4-9d1b-4d4f-8e4f-6a4a1e5e0d4f',
  nybgEast: '0eadd645-9354-4b52-a98d-1ae91f181eea',
  nybgWest: 'ca34818d-3deb-4c1d-9a16-9fe6b0e4bf5a'
}

export const Campuses = {
  All: '4a4b706f-3a88-43a1-8f0a-406e108c4d81',
  East: '9cf1b820-8a76-436d-b61c-c26346e98da5',
  Iglesia: '57c7dc4b-28bd-4718-ab44-f628c38cff4d',
  West: 'ede394da-93a1-4b61-b59f-c81453e557d1',
  Smyrna: '99caf096-790e-4120-ac99-3a7c6f6a30cb',
  Chinese: 'fd205686-8a09-4be9-ae69-3e0ef5a63686',
  MT316: '13fc12c0-c59a-4ad4-acfd-01a459f0d7e0',
  Online: '0f966792-1688-49a0-8fd0-697c9d342375',
  McKnight: '1b5e7787-454e-4514-9bbd-3b098ee5692d'
}

/**
 * @typedef {Object} Event
 * @property {string} _id
 * @property {'hidden' | 'visible'} status
 * @property {string} eventTitle
 * @property {string} eventDescription
 * @property {Date} eventStartDate
 * @property {Date} eventEndDate
 * @property {string} eventImageLandscape
 * @property {string} eventLocationName
 * @property {string} redirectUrl
 * @property {string[]} serviceOpportunities
 * @property {string[]} eventMinistries
 * @property {string} eventAssociatedCampuses
 * @property {boolean} eventNotFeatured
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
 * @property {typeof Campuses} Online
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
 * @property {Date} _createdDate
 * @property {string} scheduleDescription
 * @property {Date} _updatedDate
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
 * @property {Date} eventStartDate
 * @property {Date} eventEndDate
 * @property {string} link-events-eventTitle
 * @property {boolean} isSpecial
 */

export const Types = {}
