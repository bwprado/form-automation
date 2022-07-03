import { sendEmailToStaffDepartment } from "backend/form-automation/init";

/**
 * @function wixCrm_onFormSubmit
 * @description This is function is triggered on form submission.
 * @param {object} event - Event object
 */
export const wixCrm_onFormSubmit = async (event) => {
  await sendEmailToStaffDepartment(event);
};
