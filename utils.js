import _ from "lodash";

/**
 * @author Threed Software
 * @description File to manage the main utilities needed throughout the website
 */

import { session } from "wix-storage";
import Color from "color";

/**
 * @function Get Countdown From Memory
 * @returns {Promise<string>}
 */
export async function getCountdownFromMemory() {
  return session.getItem("live_stream_countdown");
}

export function setElementOpacity(scope, elementId, percentage) {
  // Start buy checking that we have valid arguments. NOTE: We use $w() here to verify if the elementIds are valid. We dont do
  // this while manipulating repeater items individually - this is a trick that helps with page element verification
  if (!elementId || !$w(elementId)) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Bad or Missing elementId");
  }

  if (!scope) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Missing scope");
  }

  if (!percentage || isNaN(percentage) || percentage < 0 || percentage > 1) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Missing scope");
  }

  let elementBackgroundColor = scope(elementId).style.backgroundColor;
  let color = Color(elementBackgroundColor).alpha(percentage); // force alpha for the element color
  scope(elementId).style.backgroundColor = color.string();
}

export async function setColorsFullAlpha(elementId, repeaterId) {
  // Start buy checking that we have valid arguments. NOTE: We use $w() here to verify if the elementIds are valid. We dont do
  // this while manipulating repeater items individually - this is a trick that helps with page element verification
  if (!elementId || !$w(elementId)) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Bad or Missing elementId");
  }

  if (!repeaterId || !$w(repeaterId)) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Bad or Missing repeaterId");
  }

  // We have valid arguments lets find elements to collapse. Since the collapse method is a promise we will collect all collapse promises in an array.
  //  This way we can return them in a promise all that the calling method can await on if it wants to
  let promisesPromises = [];
  $w(repeaterId).forEachItem(($item, itemData, index) => {
    // Check to see if the elementId
    if ($item(elementId)) {
      //  force the opacity setting to 1.0
      promisesPromises.push(setElementOpacity($item, elementId, 1.0));
    }
  });

  return Promise.all(promisesPromises);
}

// Utility function that will scan a repeater for elements with the elementId that are expanded and collapse them.
export async function collapseElementsInRepeater(elementId, repeaterId) {
  // We use the forEachItem to effect the collapse

  // Start buy checking that we have valid arguments. NOTE: We use $w() here to verify if the elementIds are valid. We dont do
  // this while manipulating repeater items individually - this is a trick that helps with page element verification
  if (!elementId || !$w(elementId)) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Bad or Missing elementId");
  }

  if (!repeaterId || !$w(repeaterId)) {
    // Bad argument
    throw new Error("collapseElementsInRepeater: Bad or Missing repeaterId");
  }

  // We have valid arguments lets find elements to collapse. Since the collapse method is a promise we will collect all collapse promises in an array.
  //  This way we can return them in a promise all that the calling method can await on if it wants to
  let promisesPromises = [];
  $w(repeaterId).forEachItem(($item, itemData, index) => {
    // Check to see if the elementId exists and
    if (!$item(elementId).collapsed) {
      //  We have an expanded element so update our promises list with the collapse request
      promisesPromises.push($item(elementId).collapse());
    }
  });

  return Promise.all(promisesPromises);
}

/**
 * @function handlePromises
 * @description This function is used to handle promises
 * @param {Promise} promise
 * @returns {Promise}
 */
export const handlePromises = (promise) =>
  promise.then((res) => [null, res]).catch((err) => [err]);

/**
 * @function changeFieldName
 * @description This function is used to change the fields name.
 * @param fieldName - The field name to change.
 * @returns {string} - The new field name, camel cased.
 */
const changeFieldName = (fieldName) => {
  const regex = /(?:Online|Latino|Chinese|East|West|input|dropdown|radio)/g;
  const str = fieldName.replace(regex, "");
  const cameldCase = _.camelCase(str);
  return cameldCase.replace("datePicker", "date").replace("kids", "children");
};

/**
 * @typedef {object} EventObject
 * @property {string} EventObject.contactId - Contact's id
 * @property {string} EventObject.formName - Form's name
 * @property {string} EventObject.submissionTime - Form's submission time
 * @property {object[]} EventObject.submissionData - Form's data
 */

/**
 * @typedef {object} FormData
 * @property {string} FormData.firstName - Contact's first name.
 * @property {string} [FormData.fullName] - Contact's full name for Chinese Form.
 * @property {string} [FormData.englishName] - Contact's english name for Chinese Form.
 * @property {string} FormData.lastName - Contact's last name.
 * @property {string} FormData.email - Contact's email.
 * @property {string} [FormData.phone] - Contact's phone.
 * @property {string} FormData.captcha - Form captcha.
 * @property {string} FormData.date - Planned visit date.
 * @property {string} FormData.children - Children's attendance.
 * @property {string} [FormData.kids] - Children ages.
 * @property {string} FormData.contact - Personal assistance on visit.
 * @property {string} FormData.message - Form message.
 */

/**
 * @function prepareFormData
 * @description This function changes the data structure for better usage.
 * @param {EventObject} data Event object data
 * @returns {FormData}
 */
export const prepareFormData = (event) => {
  let { fields } = event;
  const newFields = fields.map((field) => {
    return {
      fieldName: changeFieldName(field.id),
      fieldValue: field.fieldValue,
    };
  });

  return newFields;
};
