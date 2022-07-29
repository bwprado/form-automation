import * as settings from "public/form-automation/settings";
import { prepareEmailData, handlePromises } from "public/form-automation/utils";
import { triggeredEmails, contacts } from "wix-crm-backend";
import wixData from "wix-data";

const getChildrenStaff = async (formName) => {
  let emails = [];
  const [error, { items }] = await handlePromises(
    wixData
      .query("StaffRedirect")
      .eq("title", formName)
      .include("staffChildren")
      .find()
  );

  if (error) throw new Error(error);
  if (items.length === 0) return;

  const staff = items[0]["staffChildren"];
  staff.forEach(({ staffEmail }) => staffEmail && emails.push(staffEmail));
  return emails;
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

  const staff = items[0]["staff"];
  let emails = [];
  staff.forEach(({ staffEmail }) => staffEmail && emails.push(staffEmail));

  emails.push("bwprado@gmail.com"); // DEV TESTING - REMOVE IN PRODUCTION

  emails =
    children === "Yes"
      ? [...emails, ...(await getChildrenStaff(formName))]
      : emails;

  const [err, { items: staffContacts }] = await handlePromises(
    contacts.queryContacts().hasSome("info.emails.email", emails).find(options)
  );
  if (err) throw new Error(err);

  staffContacts.map((contact) => {
    try {
      triggeredEmails.emailMember(
        settings.STAFF_EMAIL_ID,
        contact._id,
        emailData
      );
    } catch (error) {
      console.log("Unable to send email to staff", contact);
    }
  });

  console.log("Email sent to staff department");
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
