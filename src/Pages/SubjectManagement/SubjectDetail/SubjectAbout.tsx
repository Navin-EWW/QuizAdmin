import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminResetPassword, UpdateAdmin } from "../../../api/admin/admin";
import _ from "lodash";
import UseToast from "../../../hooks/useToast";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import ResetPasswordFormCheck from "./ResetPasswordFormCheck";
import ResetPasswordModal from "../../../Components/ResetPasswordModal/ResetPasswordModal";
import { useFormik } from "formik";
import { number, object, ref, string } from "yup";
import { Switch } from "@headlessui/react";
import { capitalizeFirst } from "../../../utils/Capitalization";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import moment from "moment";
import ButtonSpinner from "../../../utils/ButtonSpinner";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type Props = {
  editCnt: boolean;
  setEditCnt: any;
  state: any;
  setadminRoles: React.Dispatch<any>;
  setcompareToggle: React.Dispatch<boolean>;
  setdata: React.Dispatch<any>;
  adminRoles: any[];
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: string;
      name: string;
      permission: any[];
    };
    status: string;
    updatedAt: string;
    remark: string;
  };
  profileRefetch: () => void;
  compareToggle: boolean;
  tabRedirect: boolean;
  show: boolean;
};

export default function SubjectAbout({
  profileRefetch,
  data,
  adminRoles,
  tabRedirect,
  editCnt,
  setcompareToggle,
  setdata,
  compareToggle,
  setadminRoles,
  setEditCnt,
  show,
  state,
}: Props) {
  const [open, setOpen] = useState(false);
  // const [modelToggle, setmodelToggle] = useState<boolean>(false)
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [apiError, setapiError] = useState<string>("");
  const [resetPasswordApiError, setresetPasswordApiError] =
    useState<string>("");

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const AdminSchema = object().shape({
    firstName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "First Name Must Contain Alphabet ")
      .min(2, "Minimum 2 characters are required in First Name.")
      .max(35, "Too long"),
    lastName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "Last Name Must Contain Alphabet ")
      .min(2, "Minimum 2 characters are required in Last Name.")
      .max(35, "Too long"),
    remark: string().max(100, "Too long"),
  });

  const { mutate, isLoading } = useMutation(UpdateAdmin, {
    onSuccess: (data: any) => {
      profileRefetch();
      setEditCnt(!editCnt);
      dirty && UseToast(data?.message);
    },
    onError: (data: any) => {
      if (data?.message) {
        setapiError(data?.message);
      } else {
        setapiError(data);
      }
    },
  });

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 7000);
    }
  }, [apiError]);
  const defaultValues = () => {
    setFieldValue("status", data?.status);
    setFieldValue("firstName", data?.firstName);
    setFieldValue("lastName", data?.lastName);
    setFieldValue("roleId", data?.role?.id);
    setFieldValue("remark", data?.remark);
    setTouched({});
    setapiError("");
  };

  const { mutate: resetPasswordMutate } = useMutation(AdminResetPassword, {
    onSuccess: (data: any) => {
      UseToast(data?.message);
      setOpen(false);
      resetPasswordResetForm();
      setresetPasswordApiError("");
    },
    onError: (data: any) => {
      if (data?.message) {
        setresetPasswordApiError(data?.message);
      } else {
        setresetPasswordApiError(data);
      }
    },
  });

  const resetPasswordSchema = object().shape({
    password: string()
      .required("Required Field")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Password must contain at least 8 characters, one uppercase, one lowercase and one number." ??
          ""
      )
      .max(15, "password should be maximum 15 characters"),
    confirm_password: string()
      .required("Required Field")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      )

      .oneOf([ref("password")], "Unmatch with inputted password.")
      .max(15, "password should be maximum 15 characters"),
  });

  const roleChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findId = adminRoles?.find((x) => x?.name === e?.target?.value);
    setFieldValue("roleId", findId?.id);
  };

  const cancelClicked = () => {
    if (compareToggle) {
      setcancelModel(true);
    } else {
      profileRefetch();
      setEditCnt(!editCnt);
    }
  };

  const confirmBack = () => {
    profileRefetch();
    defaultValues();
    setEditCnt(!editCnt);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  const {
    handleSubmit: handleSubmitResetPassword,
    handleBlur: resetPasswordHandleBlur,
    values: resetPaswordValues,
    handleChange: handleOnChangeResetPassword,
    errors: resetPasswordErrors,
    touched: resetPasswordTouched,
    setTouched: resetPasswordSetTouched,
    resetForm: resetPasswordResetForm,
  } = useFormik({
    validationSchema: resetPasswordSchema,
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirm_password: "",
    },

    onSubmit: async (resetPaswordValues, { resetForm }) => {
      event?.preventDefault();
      setresetPasswordApiError("");
      resetPasswordMutate({ values: resetPaswordValues, id: state });
    },
  });
  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    setTouched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: AdminSchema,
    enableReinitialize: true,
    initialValues: {
      adminId: data?.id || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      status: data?.status || "",
      roleId: data?.role?.id || "",
      remark: data?.remark || "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      mutate(values);
    },
  });

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const resetPasswordForm = () => {
    resetPasswordResetForm();
    setresetPasswordApiError("");
  };

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  return show ? (
    <div className="relative pb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit}>
        <div className="bg-white p-5 rounded-b-md overflow-hidden">
          <div className="space-y-6 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5 font-Inter">
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                <label
                  htmlFor="firstName"
                  className="block text-font_dark font-medium"
                >
                  {!editCnt ? "First Name*" : "First Name"}
                </label>

                <div className="relative mt-1 sm:col-span-2 sm:mt-0  rounded-md sm:max-w-xs max-w-lg w-full">
                  <input
                    disabled={editCnt}
                    maxLength={35}
                    type="text"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      editCnt
                        ? capitalizeFirst(data.firstName).trimStart()
                        : capitalizeFirst(values?.firstName).trimStart()
                    }
                    id="firstName"
                    className={
                      !editCnt
                        ? `block w-full max-w-lg rounded-md font-normal border  ${
                            touched?.firstName && Boolean(errors?.firstName)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`
                        : "block w-full max-w-lg rounded-md font-normal pr-10 bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                    }
                  />

                  {touched?.firstName && Boolean(errors?.firstName) && (
                    <div className="pointer-events-none absolute top-[9px]  flex items-center right-3 ">
                      <svg
                        className="h-5 w-5 fill-error_red ml-3"
                        x-description="Heroicon name: mini/exclamation-circle"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}

                  <p className="mt-21 text-sm text-error_red">
                    {touched?.firstName && Boolean(errors?.firstName)
                      ? errors.firstName
                      : ""}
                  </p>
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="lastName"
                  className="block text-font_dark font-medium"
                >
                  {!editCnt ? "Last Name*" : "Last Name"}
                </label>

                <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                  <input
                    disabled={editCnt}
                    maxLength={35}
                    type="text"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      editCnt
                        ? capitalizeFirst(data?.lastName).trimStart()
                        : capitalizeFirst(values?.lastName).trimStart()
                    }
                    id="lastName"
                    className={
                      !editCnt
                        ? `block w-full max-w-lg rounded-md font-normal border  ${
                            touched?.lastName && Boolean(errors?.lastName)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`
                        : "block w-full max-w-lg rounded-md pr-10 font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                    }
                  />

                  {touched?.lastName && Boolean(errors?.lastName) && (
                    <div className="pointer-events-none absolute top-[9px]  flex items-center right-3">
                      <svg
                        className="h-5 w-5 fill-error_red ml-3"
                        x-description="Heroicon name: mini/exclamation-circle"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}

                  <p className="mt-21 text-sm text-error_red">
                    {touched?.lastName && Boolean(errors?.lastName)
                      ? errors.lastName
                      : ""}
                  </p>
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {!editCnt ? "Email*" : "Email"}
                </label>

                <div
                  className={` mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
                >
                  <textarea
                    // style={{ resize: editCnt ? "none" : "none" }}
                    onChange={handleChange}
                    disabled={true}
                    onBlur={handleBlur}
                    value={values?.email}
                    id="email"
                    name="email"
                    // type="text"
                    rows={1}
                    className={
                      editCnt
                        ? `block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                            !editCnt ? "text-table_head_color" : ""
                          }`
                        : `block rounded-md w-full border font-normal resize-none ${
                            touched?.email && Boolean(errors?.email)
                              ? "border-error_red text-error_text "
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm ${
                            editCnt ? "text-table_head_color" : ""
                          }`
                    }
                  />
                </div>
              </div>
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {!editCnt ? "Password*" : "Password"}
                </label>
                <div className="mt-1 w-full sm:max-w-xs justify-between sm:col-span-2 sm:mt-0 max-w-lg ">
                  <div className="flex rounded-md font-normal ">
                    <input
                      name="password"
                      id="password"
                      placeholder="Password"
                      maxLength={15}
                      value="*****************"
                      disabled={true}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          : `block w-full max-w-lg rounded-md border  bg-disable_grey font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    />
                    {!editCnt && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true);
                        }}
                        // disabled={editCnt}
                        className="px-4 py-2 bg-button_color text-blue_primary rounded-r-md min-w-fit"
                      >
                        Reset Password
                      </button>
                    )}
                  </div>
                  {editCnt && (
                    <span className="text-sm text-table_head_color py-2 px-3">
                      (
                      {`last updated at ${moment(data?.updatedAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}`}
                      )
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {!editCnt ? "User Role*" : "User Role"}
                </label>
                {editCnt ? (
                  <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                    {data?.role?.name}
                  </span>
                ) : (
                  <select
                    disabled={editCnt}
                    onChange={(e) => roleChanged(e)}
                    className={
                      editCnt
                        ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                        : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                    }
                  >
                    {adminRoles?.map((x: any, i: number) => (
                      <option key={i}>{x?.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="remark"
                  className="block text-font_dark font-medium"
                >
                  Remarks
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    // type="text"
                    name="remark"
                    style={{ resize: editCnt ? "none" : "vertical" }}
                    maxLength={100}
                    id="remark"
                    value={editCnt ? data?.remark : values?.remark ?? ""}
                    placeholder=""
                    onChange={handleChange}
                    disabled={editCnt}
                    rows={4}
                    className={
                      editCnt
                        ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                        : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                    }
                  />
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Active
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {editCnt ? (
                    <SwitchToggle
                      disabled={editCnt}
                      enabled={data?.status === "ACTIVE"}
                    />
                  ) : (
                    <SwitchToggle
                      enabled={values?.status === "ACTIVE"}
                      onChange={() => {
                        setFieldValue(
                          "status",
                          values.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                        );
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                {apiError && (
                  <p className="mt-21 text-sm text-error_red">{apiError}</p>
                )}

                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      type="submit"
                      disabled={!dirty || isLoading}
                      className={`rounded-md ${
                        dirty
                          ? "bg-blue_primary hover:bg-hoverChange"
                          : " bg-grey_border_table_disable"
                      }  py-2 px-4 text-sm font-medium text-white min-w-[33px] focus:outline-none`}
                    >
                      {isLoading ? <ButtonSpinner /> : "Save"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-grey_border_table bg-transparent hover:bg-grey_bg py-2 px-4 text-sm font-medium text-font_dark focus:outline-none  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                      onClick={cancelClicked}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <DialogBox
                  // @ts-ignore
                  showDialog={showPrompt}
                  confirmNavigation={confirmNavigation}
                  cancelNavigation={cancelNavigation}
                />
                <DialogBox
                  showDialog={cancelModel}
                  confirmNavigation={confirmBack}
                  cancelNavigation={cancelBack}
                />
              </div>
            </div>
          </div>
        </div>

        <ResetPasswordModal
          disableEyeIcon={true}
          open={open}
          passwordError={resetPasswordErrors?.password}
          confirm_passwordError={resetPasswordErrors?.confirm_password}
          setOpen={setOpen}
          state={state}
          confirmPasswordStatus={
            resetPasswordTouched?.confirm_password &&
            Boolean(resetPasswordErrors?.confirm_password)
          }
          passwordStatus={
            resetPasswordTouched?.password &&
            Boolean(resetPasswordErrors?.password)
          }
          handleSubmit={handleSubmitResetPassword}
          onChange={handleOnChangeResetPassword}
          onBlur={resetPasswordHandleBlur}
          apiError={resetPasswordApiError}
          resetForm={resetPasswordForm}
        />
      </form>
    </div>
  ) : null;
}

export interface ErrorsState {
  [id: string]: string;
}

const initialAdminData: AdminDataType = {
  firstName: "",
  lastName: "",
  roleId: "",
  remark: "",
  status: "",
  adminId: "",
};

export interface AdminDataType {
  firstName: string;
  lastName: string;
  roleId: string;
  remark: string;
  adminId: string;
  status: string;
}

export interface ResetPasswordDataType {
  password: string;
  confirm_password: string;
}
const initialResetPasswordData: ResetPasswordDataType = {
  password: "",
  confirm_password: "",
};

export interface ErrorsStateResetPassword {
  [id: string]: string;
}
