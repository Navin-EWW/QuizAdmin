

import { CountryCode, isPossiblePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
function PhoneNumberValidator(number: string, code: CountryCode) {
    const phoneNumValidation =
        isPossiblePhoneNumber(String(number), code) &&  isValidPhoneNumber(String(number), code)
    return phoneNumValidation
}


export default PhoneNumberValidator

