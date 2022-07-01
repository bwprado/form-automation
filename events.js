import { sendEmailToStaffDepartment } from "backend/form-automation/init";

export const wixCrm_onFormSubmit = async (event) => {
  await sendEmailToStaffDepartment(event);
};
