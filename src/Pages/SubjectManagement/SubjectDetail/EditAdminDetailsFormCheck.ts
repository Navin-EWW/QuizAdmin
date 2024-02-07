import { ErrorsState } from "./SubjectAbout";

const EditAdminDetailsForm = (adminData: any) => {
  const errors: ErrorsState = {};

  if (!adminData?.firstName?.trim()) {
    errors["firstName"] = "Enter the Admin Name";
  }
  if (!adminData?.lastName?.trim()) {
    errors["lastName"] = "Enter the Admin Name";
  }

  if (!adminData?.roleId?.trim()) {
    errors["roleId"] = "Required field";
  }

  return errors;
};

export default EditAdminDetailsForm;
