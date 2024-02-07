export interface DefaultApiResponse {
  status: boolean;
  message?: string;
}

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNo: string;
  language: string;
  jobCapacity: string;
  company: {
    legalEntityName: string;
  };
  passwordChangedAt: string;
  updatedAt: string;
  createdAt: Date;
};

export interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  removeAll: ()=>void;
}

export type WarningProp = {
  open: boolean;
  setOpen: (value: boolean) => void;
  header: string;
  subHeader: string;
};

export type ForgotPasswordProp = {
  email?: string;
};

interface FieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  labelCss: string;
  extraCSS?: string;
  errorMsg: string;
  placeholder: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextFieldProps extends FieldProps {
  error: boolean;
  value: string;
}

export interface PasswordFieldProps extends FieldProps {
  show: boolean;
  eyeOnclick?: React.MouseEventHandler<HTMLElement>;
  value: string;
}

export type Typestate = {
  countryId: string;
  id: string;
  latitude: string;
  longitude: string;
  name: string;
  stateCode: string;
};
export type Typecity = {
  id: string;
  latitude: string;
  longitude: string;
  name: string;
  stateId: string;
};