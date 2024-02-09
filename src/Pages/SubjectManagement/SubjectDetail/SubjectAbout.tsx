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
  state,
}: Props) {
  

  return (
    <div className="relative pb-10">
      <form className="space-y-8 shadow-md" onSubmit={()=>{
console.log("-----------")
      }}>
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
                    // onBlur={handleBlur}
                    // onChange={handleChange}
                    // value={
                    //   editCnt
                    //     ? capitalizeFirst(data.firstName).trimStart()
                    //     : capitalizeFirst(values?.firstName).trimStart()
                    // }
                    id="firstName"
                    className={
                      !editCnt
                        ? `block w-full max-w-lg rounded-md font-normal border  ${
                        true
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`
                        : "block w-full max-w-lg rounded-md font-normal pr-10 bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                    }
                  />

                  {/* {touched?.firstName && Boolean(errors?.firstName) && (
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
                  )} */}

                  {/* <p className="mt-21 text-sm text-error_red">
                    {touched?.firstName && Boolean(errors?.firstName)
                      ? errors.firstName
                      : ""}
                  </p> */}
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
                    // onBlur={handleBlur}
                    // onChange={handleChange}
                    // value={
                    //   editCnt
                    //     ? capitalizeFirst(data?.lastName).trimStart()
                    //     : capitalizeFirst(values?.lastName).trimStart()
                    // }
                    id="lastName"
                    className={
                      !editCnt
                        ? `block w-full max-w-lg rounded-md font-normal border  ${
                            true
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`
                        : "block w-full max-w-lg rounded-md pr-10 font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                    }
                  />

                  {/* {touched?.lastName && Boolean(errors?.lastName) && (
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
                  )} */}

                  {/* <p className="mt-21 text-sm text-error_red">
                    {touched?.lastName && Boolean(errors?.lastName)
                      ? errors.lastName
                      : ""}
                  </p> */}
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
                    // onChange={handleChange}
                    disabled={true}
                    // onBlur={handleBlur}
                    // value={values?.email}
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
                           true
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
                    {/* {!editCnt && (
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
                    )} */}
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
                    // value={editCnt ? data?.remark : values?.remark ?? ""}
                    placeholder=""
                    // onChange={handleChange}
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

            
           
            </div>
          </div>
        </div>

        {/* <ResetPasswordModal
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
        /> */}
      </form>
    </div>
  )
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
