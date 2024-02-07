import validator from "validator";

export const isEmailValid = (email: string) => {
  return validator.isEmail(email);
};

export const isContactNumberValid = (contactNumber: string) => {
  return validator.isMobilePhone(contactNumber);
  // return validator.isMobilePhone(contactNumber, 'en-IN')
};

export const isInputNumber = (value: string) => {
  return validator.isNumeric(value);
};

export const checkIfNumber = (event: any) => {
  /**
   * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
   **/

  const regex = new RegExp(
    /(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/
  );

  return !event.key.match(regex) && event.preventDefault();
};
