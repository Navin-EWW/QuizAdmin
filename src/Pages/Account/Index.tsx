export interface ErrorsState {
  [id: string]: string;
}

export interface ResetPasswordDataType {
  current_password: string;
  password: string;
  confirm_password: string;
}