/* eslint-disable no-useless-escape */
import { isEmailValid } from '../../utils/validators'
import { ErrorsState, ForgotPasswordDataType } from './index'

const ForgotPasswordFormCheck = (forgotPasswordData: ForgotPasswordDataType) => {
  const errors: ErrorsState = {}

  if (!forgotPasswordData.email) {
    errors['email'] = 'Please Enter Email Address.'
  } else if (!isEmailValid(forgotPasswordData.email)) {
    errors['email'] = 'Please Enter A Valid Email Address.'
  }
  
  return errors
}

export default ForgotPasswordFormCheck