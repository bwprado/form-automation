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
 * @function camelCase
 * @description This function converts the string to camel case.
 * @param str - string to be camel cased
 * @returns {string} - camel cased string
 */
export const camelCase = (str) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

/**
 * @typedef {object} EventObject
 * @property {string} EventObject.contactId - Contact's id
 * @property {string} EventObject.formName - Form's name
 * @property {string} EventObject.submissionTime - Form's submission time
 * @property {object[]} EventObject.submissionData - Form's data
 */

/**
 * @function prepareFormData
 * @description This function changes the data structure for better usage.
 * @param {EventObject} data Event object data
 * @returns {object}
 */
const prepareFormData = (data) => {
  let newObj = {};
  let { submissionData, formName, contactId } = data;
  submissionData.forEach((d) => {
    newObj[d.fieldName] = d.fieldValue;
  });
  newObj.formName = formName;
  newObj.contactId = contactId;
  return newObj;
};

/**
 * @function handlePromises
 * @description This function is used to handle promises
 * @param {Promise} promise
 * @returns {Promise}
 */
export const handlePromises = (promise) =>
  promise.then((res) => [null, res]).catch((err) => [err]);
