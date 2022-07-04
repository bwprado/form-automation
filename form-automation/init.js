import * as settings from "public/form-automation/settings";
import { retrieveDateAndTime } from "public/form-automation/utils";
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
  const { submissionData, formName } = event;
  let variables = {};
  submissionData.forEach((d) => {
    d.fieldName !== "captcha" && (variables[d.fieldName] = d.fieldValue);
  });
  variables.location = settings.location[formName];
  variables.children = variables.children === "children-yes" ? "Yes" : "No";
  variables.contact = variables.contact === "contact-yes" ? "Yes" : "No";
  let dateOfService = retrieveDateAndTime(
    variables.service,
    variables.date,
    formName
  );
  variables.date = dateOfService.date.toLocaleDateString("en-US", dateOptions);
  variables.serviceTime = dateOfService.time || "";
  variables.service = variables.service === "online" ? "Online" : "In-Person";
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
 * @function sendEmailToStaffDepartment
 * @description This function sends emails to staff department
 * @param {string} departmentId - Department's id
 * @param {string} emailId - Email's id
 * @param {object} email - The email object
 * @returns {Promise<object>}
 */
export const sendEmailToStaffDepartment = async (
  departmentId,
  emailId,
  email
) => {
  const [error, { items: staff }] = await handlePromises(
    wixData
      .query("Staff")
      .hasSome("staffDepartment", departmentId)
      .eq("lastName", "Prado") //TESTING PURPOSES
      .find()
  );

  if (error) throw new Error(error);
  if (staff.length === 0) return;

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

  console.log("Email sent to staff department");
};

/**
 * @function sendEmailToCampuses
 * @description This function sends emails to staff campuses
 * @param {string} campusId - Campuses id
 * @param {string} emailId - Email's id
 * @param {object} email - The email object
 * @returns {Promise<object>}
 */
export const sendEmailToCampuses = async (campusId, emailId, email) => {
  const [error, { items: staff }] = await handlePromises(
    wixData
      .query("Staff")
      .hasSome("staffCampus", campusId)
      .eq("lastName", "Prado") //TESTING PURPOSES
      .find()
  );

  if (error) throw new Error(error);
  if (staff.length === 0) return;

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

  console.log("Email sent to staff campuses");
};

/**
 * @function sendEmailToPlannedVisitor
 * @description This function sends emails to Visitor
 * @param {string} contactId - Contact's id
 * @returns {Promise<object>}
 */
export const sendEmailToPlannedVisitor = async (contactId, email) => {
  const [error] = await handlePromises(
    triggeredEmails.emailContact(settings.VISITOR_EMAIL_ID, contactId, email)
  );

  if (error) throw new Error(error);
  console.log("Email sent to visitor");
};

/**
 * @function formAutomation
 * @description This function is called when form is submitted
 * @param {object} event - Event Object
 */
export const formAutomation = async (event) => {
  const { submissionData, contactId, formName } = event;
  const bringChildren = checkForChildrenInclusion(submissionData);
  const email = prepareEmailData(event);
  if (bringChildren) {
    const [error] = await handlePromises(
      sendEmailToStaffDepartment(
        settings.departments["children"],
        settings.STAFF_EMAIL_ID,
        email
      )
    );

    if (error) throw new Error(error);
    console.log("Email was sent to children department");
  }
  const [err1] = await handlePromises(
    sendEmailToCampuses(
      settings.campuses[formName],
      settings.STAFF_EMAIL_ID,
      email
    )
  );

  if (err1) return err1;

  const [err2] = await handlePromises(
    sendEmailToPlannedVisitor(contactId, email)
  );

  if (err2) return err2;
};
