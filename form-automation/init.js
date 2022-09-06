import * as settings from "public/form-automation/settings";
import { prepareEmailData, handlePromises } from "public/form-automation/utils";
import { triggeredEmails, contacts } from "wix-crm-backend";
import wixData from "wix-data";

export const sendTriggeredEmail = async (contacts, emailId, emailData) => {
  contacts.map((contact) => {
    try {
      triggeredEmails.emailContact(emailId, contact._id, emailData);
    } catch (error) {
      console.error("Unable to send email to staff", contact);
    }
  });
};

const sendEmailToChildrenStaffDepartment = async (emailData) => {
  const options = { suppressAuth: true };
  const { variables } = emailData;
  const { formName } = variables;
  const [error, { items }] = await handlePromises(
    wixData
      .query("StaffRedirect")
      .eq("title", formName)
      .include("staffChildren")
      .find()
  );
  if (error) throw new Error(error);
  if (items.length === 0) return;

  const staffEmails = items[0]["staffChildren"]
    .filter(({ staffEmail }) => staffEmail)
    .map(({ staffEmail }) => staffEmail);

  const [err, { items: childrenStaffContacts }] = await handlePromises(
    contacts
      .queryContacts()
      .hasSome("info.emails.email", staffEmails)
      .find(options)
  );
  if (err) throw new Error(err);

  sendTriggeredEmail(childrenStaffContacts, settings.STAFF_CHILD_EMAIL_ID, {
    variables
  });
  console.log("Email sent to children staff department");
};

/**
 * @function sendEmailToStaffDepartment
 * @description This function sends emails to staff department
 * @param {object} emailData - The email object
 * @property {object} emailData.variables - The email variables
 * @returns {Promise<object>}
 */
export const sendEmailToStaffDepartment = async (emailData) => {
  const options = { suppressAuth: true };
  const { variables } = emailData;
  const { children, formName } = variables;
  const [error, { items }] = await handlePromises(
    wixData.query("StaffRedirect").eq("title", formName).include("staff").find()
  );
  if (error) throw new Error(error);
  if (items.length === 0) return;

  const staffEmails = items[0]["staff"]
    .filter(({ staffEmail }) => staffEmail)
    .map(({ staffEmail }) => staffEmail);

  const [err, { items: staffContacts }] = await handlePromises(
    contacts
      .queryContacts()
      .hasSome("info.emails.email", staffEmails)
      .find(options)
  );
  if (err) throw new Error(err);

  sendTriggeredEmail(staffContacts, settings.STAFF_EMAIL_ID, { variables });
  console.log("Email sent to staff department");

  children === "Yes" && sendEmailToChildrenStaffDepartment(emailData);
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
  const options = { suppressAuth: true };
  const { fields } = event;
  const emailData = prepareEmailData(fields);
  const { variables } = emailData;
  const [error, { items: contact }] = await handlePromises(
    contacts
      .queryContacts()
      .hasSome("info.emails.email", variables.email)
      .find(options)
  );
  if (error) throw new Error(error);
  if (contact.length === 0) throw new Error("Contact not found");

  const [err] = await handlePromises(sendEmailToStaffDepartment(emailData));
  if (err) throw new Error(err);

  const [err1] = await handlePromises(
    sendEmailToPlannedVisitor(contact[0]._id, emailData)
  );
  if (err1) throw Error(err1);
};
