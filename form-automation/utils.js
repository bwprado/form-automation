import _ from "lodash";
import { location } from "public/form-automation/settings";
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
 * @function prepareFormData
 * @description This function changes the data structure for better usage.
 * @param {Array<object>} fields Form fields array
 * @returns {Array<object>}
 */
export const prepareFormData = (fields) => {
  const regex = /(captcha|date)/g;
  fields.forEach((field) => {
    if (regex.test(field.id)) return;
    if (field.id.includes("radio")) return;
    field.fieldValue = `${changeFieldName(field.id)} | ${field.fieldValue}`;
  });
  return fields;
};

/**
 * @function retrieveDateAndTime
 * @description This function retrieves the date and time of the planned visit.
 * @param {string} timeStr - string like 8:00
 * @param {string} dateStr - string in the format of "Sun Jul 03 2022 00:00:00 GMT-0300 (Brasilia Standard Time)"
 * @returns {object} - object with the date and time of the planned visit
 */
export const retrieveDateAndTime = (timeStr, dateStr, formName) => {
  let dateObj = {};
  const time = formName === "Chinese" ? "9:30" : timeStr || "10:30";
  const hour = +time.split(":")[0];
  const min = +time.split(":")[1];
  dateObj.date = new Date(dateStr);
  dateObj.date.setHours(hour, min);
  dateObj.time = dateObj.date.toLocaleTimeString("en-US");

  return dateObj;
};

/**
 * @typedef {Array<Object>} FormFields
 */

/**
 * @function prepareEmailData
 * @description This function changes the data structure for email data.
 * @param {FormFields} fields Form data fields to convert to email.
 * @returns {object} email variables
 */
export const prepareEmailData = (fields) => {
  const formName = fields[0].id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(" ")
    .slice(-1)[0];
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let variables = {};
  fields.forEach((d) => (variables[changeFieldName(d.id)] = d.fieldValue));
  variables.children = variables.children === "children-yes" ? "Yes" : "No";
  variables.contact = variables.contact === "contact-yes" ? "Yes" : "No";
  let dateOfService = retrieveDateAndTime(
    variables.service,
    variables.date,
    formName
  );
  variables.date = dateOfService.date.toLocaleDateString("en-US", dateOptions);
  variables.service = formName === "Online" ? formName : "In-Person";
  variables.serviceTime = dateOfService.time || "";
  variables.location = location[formName];
  variables.formName = formName;
  return { variables };
};
