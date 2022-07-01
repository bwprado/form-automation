import * as settings from "backend/form-automation/settings";
import { triggeredEmails, contacts } from "wix-crm-backend";
import wixData from "wix-data";

/**
 * @function handlePromises
 * @description This function is used to handle promises
 * @param {Promise} promise
 * @returns {Promise}
 */
const handlePromises = (promise) =>
  promise.then((res) => [null, res]).catch((err) => [err]);

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
 * @param {string} department - Department's id
 * @returns {Promise<object>}
 */
export const sendEmailToStaff = async (departmentId, email) => {
  const options = {
    supressAuth: true,
  };
  const [error, { items: staff }] = await handlePromises(
    wixData.query("Staff").eq("staffDepartment", departmentId).find()
  );

  if (error) throw new Error(error);

  const emails = staff.map(({ staffEmail }) => staffEmail);
  const staffIds = emails.map((email) =>
    contacts.getContacts().hasSome("info.emails.email", email).find(options)
  );
  const [err, allStaffIds] = await handlePromises(Promise.all(staffIds));

  if (err) throw new Error(err);

  const staffIdsToSend = allStaffIds.filter((id) => id);
  const [err2, emailsToSend] = await handlePromises(
    triggeredEmails.emailMember(email, staffIdsToSend)
  );

  if (err2) throw new Error(err2);

  return emailsToSend;
};

export const sendEmailToPlannedVisitor = async (contactId) => {
  const [error, email] = await handlePromises(
    triggeredEmails.emailContact(settings.PLANNED_VISIT_EMAIL_ID, contactId)
  );

  if (error) throw new Error(error);

  return email;
};

export const sendEmailToStaffDepartment = async (event) => {
  const { formName, submissionData, contactId } = event;
  const bringChildren = checkForChildrenInclusion(submissionData);
  bringChildren &&
    (await sendEmailToStaff(
      settings.departments["children"],
      settings.CHILDREN_EMAIL_ID
    ));
  await sendEmailToStaff(
    settings.campuses[formName],
    settings.campusesEmailsIds[formName]
  );
  await sendEmailToPlannedVisitor(contactId);
};
