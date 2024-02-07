import { ErrorsState, ResetPasswordDataType } from "./AdminAbout";


const ResetPasswordFormCheck = (data: ResetPasswordDataType) => {
  const errors: ErrorsState = {};

  if (!data?.password?.trim()) {
    errors["password"] = "Required field";
  } else {
    if (typeof data["password"] !== "undefined") {
      // const pattern = new RegExp(/^/)
      const pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
      if (!pattern.test(data["password"])) {
        errors["password"] =
          "Password must contain at least 8 characters, one uppercase, one lowercase and one number.";
      }
    }
  }
  if (!data?.confirm_password?.trim()) {
    errors["confirm_password"] = "Required field";
  } else {
    if (data?.confirm_password !== data?.password) {
      errors["confirm_password"] =
        "Password and confirm password does not match.";
    }
  }
  return errors;
};

export default ResetPasswordFormCheck;
