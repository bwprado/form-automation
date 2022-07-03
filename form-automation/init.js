import * as settings from "public/form-automation/settings";
import { triggeredEmails, contacts } from "wix-crm-backend";
import { handlePromises } from "public/form-automation/utils";
import wixData from "wix-data";

/**
 * @typedef {object} EventObject
 * @property {string} EventObject.formName - Wix Form Name
 * @property {object} EventObject.contactId - Wix Form Contact ID
 * @property {Array<{fieldName: string, fieldValue: string}>} submissionData - Data submitted to form
 */
/**
 * @function prepareEmailData
 * @description This function changes the data structure for email data.
 * @param {EventObject} event Form data to be converted
 * @returns {object} email variables
 */
const prepareEmailData = (event) => {
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const { submissionData, formName, contactId } = event;
  let variables = {};
  submissionData.forEach((d) => {
    d.fieldName !== "captcha" && (variables[d.fieldName] = d.fieldValue);
  });
  variables.location = settings.location[formName];
  variables.children = variables.children === "children-yes" ? "Yes" : "No";
  variables.contact = variables.contact === "contact-yes" ? "Yes" : "No";
  variables.date = new Date(variables.date).toLocaleDateString(
    "en-US",
    dateOptions
  );
  variables.contactId = contactId;
  return { variables };
};

/**
 * @function checkForChildrenInclusion
 * @description This function checks for the children answers and returns the answer
 * @param {object} data - The data object
 * @returns {boolean} true or false
 */
const checkForChildrenInclusion = (data) =>
  data.some((item) => item.fieldValue.includes("children-yes"));

/**
 * @function sendEmailToStaff
 * @description This function sends emails to staff
 * @param {string} departmentId - Department's id
 * @param {string} emailId - Email's id
 * @param {object} data - The data object
 * @returns {Promise<object>}
 */
export const sendEmailToStaff = async (departmentId, emailId, email) => {
  const [error, { items: staff }] = await handlePromises(
    wixData
      .query("Staff")
      .hasSome("staffDepartment", departmentId)
      .eq("lastName", "Prado") //TESTING PURPOSES
      .find()
  );
  if (error) throw new Error(error);

  let emails = [];
  staff.forEach(({ staffEmail }) => staffEmail && emails.push(staffEmail));
  const [err, { items: staffContacts }] = await handlePromises(
    contacts.queryContacts().hasSome("info.emails.email", emails).find()
  );

  if (err) throw new Error(err);

  const allStaffEmails = staffContacts.map((contact) =>
    triggeredEmails.emailMember(emailId, contact._id, email)
  );
  const [err2] = await handlePromises(Promise.all(allStaffEmails));

  if (err2) throw new Error(err2);
};

/**
 * @function sendEmailToPlannedVisitor
 * @description This function sends emails to Visitor
 * @param {string} contactId - Contact's id
 * @returns {Promise<object>}
 */
export const sendEmailToPlannedVisitor = async (contactId) => {
  const [error, email] = await handlePromises(
    triggeredEmails.emailContact(settings.PLANNED_VISIT_EMAIL_ID, contactId)
  );

  if (error) throw new Error(error);

  return email;
};

/**
 * @function sendEmailToStaffDepartment
 * @description This function is called when form is submitted
 * @param {object} event - Event Object
 */
export const sendEmailToStaffDepartment = async (event) => {
  const bringChildren = checkForChildrenInclusion(submissionData);
  const email = prepareEmailData(event);
  const [error] =
    bringChildren &&
    (await handlePromise(
      sendEmailToStaff(
        settings.departments["children"],
        settings.PLANNED_VISIT_EMAIL_ID,
        email
      )
    ));

  if (error) throw new Error(error);
  console.log("Email was sent to staff department");
  // await sendEmailToStaff(
  //   settings.campuses[formName],
  //   settings.campusesEmailsIds[formName]
  // );
  // await sendEmailToPlannedVisitor(contactId);
};
