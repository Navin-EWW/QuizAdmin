import { isContactNumberValid } from "../../../utils/validators";
import { ErrorsState } from "./UserAbout";

const EditUserDetailsForm = (data: any) => {
  const errors: ErrorsState = {};

  if (!data?.firstName?.trim()) {
    errors["firstName"] = "Enter the User Name";
  }
  if (!data?.lastName?.trim()) {
    errors["lastName"] = "Enter the User Name";
  }

  if (!data?.phoneNo?.trim()) {
    errors["phoneNo"] = "Enter the User Number";
  } else {
    if (!isContactNumberValid(data?.phoneNo)) {
      errors["phoneNo"] = "Invalid Number format";
    }
  }

  return errors;
};

export default EditUserDetailsForm;
