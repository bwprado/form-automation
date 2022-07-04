import _ from "lodash";
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
  return cameldCase
    .replace("datePicker", "date")
    .replace("kids", "childrenDetails");
};

/**
 * @typedef {object} EventObject
 * @property {object} EventObject.context - Wix Form Context
 * @property {string} EventObject.type - Wix Form Event Type
 * @property {object[]} EventObject.fields - Form's data
 */
/**
/**
 * @function prepareFormData
 * @description This function changes the data structure for better usage.
 * @param {EventObject} event Event object data
 * @returns {object[]}
 */
export const prepareFormData = (event) => {
  let { fields } = event;
  return fields.map((field) => {
    return {
      fieldName: changeFieldName(field.id),
      fieldValue: field.fieldValue,
    };
  });
};

/**
 * @function retrieveDateAndTime
 * @description This function retrieves the date and time of the planned visit.
 * @param {string} timeStr - string like 8-east
 * @param {string} dateStr - string in the format of "Sun Jul 03 2022 00:00:00 GMT-0300 (Brasilia Standard Time)"
 * @returns {object} - object with the date and time of the planned visit
 */
export const retrieveDateAndTime = (timeStr, dateStr) => {
  let dateObj = {};
  dateObj.date = new Date(dateStr);

  const isThereTime = /\d/.test(timeStr);
  if (isThereTime) {
    const newTimeStr = timeStr.split("-")[0];
    dateObj.timezone =
      timeStr.split("-")[1].charAt(0).toUpperCase() ||
      "" + timeStr.split("-")[1].slice(1) ||
      "";
    dateObj.time = newTimeStr.slice(0, 2) + ":" + newTimeStr.slice(2) || "";
    dateObj.date.setHours(
      +dateObj.time.split(":")[0],
      +dateObj.time.split(":")[1] || 0
    );
  }

  return dateObj;
};
