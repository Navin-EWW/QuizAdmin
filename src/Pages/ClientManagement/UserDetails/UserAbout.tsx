import { useEffect, useMemo, useState } from "react";
import { Listbox, Switch, Transition } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import _ from "lodash";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import { flagArray } from "../../../utils/Flags";
import { UpdateUser, UserResetPassword } from "../../../api/merchant/user";
import FormInputFiled from "./FormInputFiled";
import moment from "moment";
import ResetPasswordModal from "../../../Components/ResetPasswordModal/ResetPasswordModal";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import ResetPasswordFormCheck from "../../AdminManagement/AdminDetail/ResetPasswordFormCheck";
import { useFormik } from "formik";
import { object, ref, string } from "yup";
import { capitalizeFirst } from "../../../utils/Capitalization";
import PhoneNumberValidator from "../../../utils/PhoneNumberValidator";
import ButtonSpinner from "../../../utils/ButtonSpinner";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type Props = {
  editCnt: boolean;
  setEditCnt: any;
  state: any;
  setuserData: React.Dispatch<any>;
  userData: {
    email: string;
    lastLogin: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    phoneCode: string;
    phoneNo: string;
    title: string;
    merchantId: string;
    status: string;
    createdOn: string;
    language: string;
    merchant: {
      id: string;
      legalEntityName: string;
      name: string;
      merchantCode: string;
    };
    createdBy: {
      firstName: string;
      lastName: string;
    };
  };
  defaultFlag: any;
  merchantList: any[];
  compareToggle: boolean;
  languageArray: any[];
  tabRedirect: boolean;
  selectedFlag: any;
  setcompareToggle: React.Dispatch<boolean>;
  setselectedFlag: React.Dispatch<any>;
  profileRefetch: () => void;
  show: boolean;
};

export default function UserAbout({
  userData,
  merchantList,
  profileRefetch,
  defaultFlag,
  editCnt,
  tabRedirect,
  setuserData,
  compareToggle,
  setEditCnt,
  setcompareToggle,
  setselectedFlag,
  languageArray,
  selectedFlag,
  state,
  show,
}: Props) {
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [resetPasswordApiError, setresetPasswordApiError] =
    useState<string>("");

  const [apiError, setapiError] = useState<any>({});
  const [resetPasswordModal, setresetPasswordModal] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const switchOnChange = (e: any) => {
    setFieldValue("status", values.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
  };

  const cancelClicked = () => {
    if (compareToggle) {
      setcancelModel(true);
    } else {
      setEditCnt(!editCnt);
    }
  };
  const { mutate: resetPasswordMutate } = useMutation(UserResetPassword, {
    onSuccess: (data: any) => {
      UseToast(data?.message);
      setresetPasswordModal(false);
      resetPasswordResetForm();
    },
    onError: (data: any) => {
      if (data?.message) {
        setresetPasswordApiError(data?.message);
      } else {
        setresetPasswordApiError(data);
      }
    },
  });

  const { mutate, isLoading } = useMutation(UpdateUser, {
    onSuccess: (data: any) => {
      dirty && UseToast(data?.message);
      profileRefetch();
      setEditCnt(!editCnt);
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setapiError({ status: false, message: data })
        : setapiError(data);
    },
  });

  useEffect(() => {
    if (!apiError.status) {
      setTimeout(() => {
        setapiError("");
      }, 7000);
    }
  }, [apiError]);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }
  const onSelect = (e: any) => {
    const splitedDialCode = e?.dialCode.split("+").join("");
    setFieldValue("phoneCode", splitedDialCode);
    setselectedFlag(e);
  };

  const merchantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const merchandId = merchantList?.find((x) => x?.name === e?.target?.value);
    setFieldValue("merchant", {
      id: merchandId?.id,
      name: merchandId?.name,
      legalEntityName: merchandId?.legalEntityName,
      country: merchandId?.country,
      merchantCode: merchandId?.merchantCode,
    });
    setFieldValue("merchantId", merchandId?.id);
  };

  const changeLanguageCalled = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const findLanguage = languageArray?.find(
      (x) => x?.name === e?.target?.value
    );
    setFieldValue("language", findLanguage?.code);
  };

  const UserBasicSchema = object().shape({
    firstName: string()
      .trim("Required Field")
      .required("Required Field")
      .min(2, "Minimum 2 characters are required in first name.")
      .max(35, "Maximun 35 characters are required in first name.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in first name.")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "First name can't start or end with a blank space."
      ),
    lastName: string()
      .trim("Required Field")
      .required("Required Field")
      .min(2, "Minimum 2 characters are required in last name.")
      .max(35, "Maximun 35 characters are required in last name.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in last name.")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "Last name can't start or end with a blank space."
      ),

    phoneNo: string()
      .required("Required Field")
      .trim("Required Field")
      .max(32, "Too long")
      .test("errorPhoneNo", "Invalid phone number" ?? "", (value) => {
        return PhoneNumberValidator(value ?? "", selectedFlag.code);
      }),
    title: string(),
    language: string().required("Required Field").trim("Required Field"),
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
    setErrors,
    setFieldValue,
  } = useFormik({
    validationSchema: UserBasicSchema,
    enableReinitialize: true,
    initialValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneCode: userData?.phoneCode || "",
      phoneNo: userData?.phoneNo || "",
      title: userData?.title || "",
      merchantId: userData?.merchantId || "",
      status: userData?.status || "",
      language: userData?.language || "",
      merchant: userData?.merchant || "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({ ...values, userId: state?.id });
    },
  });

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("language", userData?.language);
    setFieldValue("merchantId", userData?.merchantId);
    setFieldValue("merchant", userData?.merchant);
    setFieldValue("phoneCode", userData?.phoneCode);
    setFieldValue("status", userData?.status);
    setFieldValue("firstName", userData?.firstName);
    setFieldValue("lastName", userData?.lastName);
    setFieldValue("phoneNo", userData?.phoneNo);
    setFieldValue("title", userData?.title);
    setselectedFlag(defaultFlag);
    setTouched({});
    setapiError("");
  };

  const confirmBack = () => {
    defaultValues();
    setEditCnt(true);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  const resetPasswordSchema = object().shape({
    password: string()
      .required("Required Field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Password must contain at least 8 characters, one uppercase, one lowercase and one number." ??
          ""
      )
      .max(15, "password should be maximum 15 characters")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      ),
    confirm_password: string()
      .required("Required Field")

      .oneOf([ref("password")], "Unmatch with inputted password")
      .max(15, "password should be maximum 15 characters")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      ),
  });

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

      resetPasswordMutate({
        values: { ...resetPaswordValues, userType: "USER" },
        id: state?.id,
      });
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = _.get(e, "target.value");
    if (value !== " ") {
      if (value?.length === 33) {
        return null;
      } else {
        setFieldValue("phoneNo", value);
      }
    }
  };

  return show ? (
    <div className="relative pb-10">
      <form
        className="space-y-8 shadow-md rounded-b-lg"
        onSubmit={handleSubmit}
      >
        <div className="bg-white p-5 rounded-b-lg">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                Merchant Information
              </h3>
            </div>

            <div className="space-y-6 sm:space-y-5 font-Inter">
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-font_dark font-medium"
                >
                  Merchant Name
                </label>
                <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md sm:max-w-xs max-w-lg w-full">
                  {editCnt ? (
                    <span
                      className={`block ${
                        values?.merchant?.name?.length > 50 && "overflow-x-auto"
                      } align-baseline cursor-default w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm`}
                    >
                      {values?.merchant?.name}
                    </span>
                  ) : (
                    <select
                      disabled={editCnt}
                      onChange={(e) => merchantChange(e)}
                      value={values?.merchant?.name}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      {merchantList?.map((x: any, i: number) => (
                        <option key={i}>{x?.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <FormInputFiled
                disabled={true}
                label="Entity Name"
                editCnt={editCnt}
                value={
                  editCnt
                    ? userData?.merchant?.legalEntityName
                    : values?.merchant?.legalEntityName
                }
                id="legalEntityName"
                name="legalEntityName"
                type="text"
              />

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Entity Name
                </label>

                <div
                  className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
                >
                  <textarea
                    style={{ resize: "none" }}
                    // onChange={handleChange}
                    disabled={true}
                    // onBlur={handleBlur}
                    value={
                      editCnt
                        ? userData?.merchant?.legalEntityName
                        : values?.merchant?.legalEntityName
                    }
                    rows={values?.merchant?.legalEntityName?.length > 40 ? 2 : 1}
                    id="legalEntityName"
                    name="legalEntityName"
                    className={`block  pr-10 w-full max-w-lg rounded-md font-normal ${
                      editCnt ? "bg-transparent" : "bg-[#fafafa]"
                    } focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                      !editCnt
                        ? "text-table_head_color border border-grey_border_table"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <FormInputFiled
                disabled={true}
                label="Merchant Code"
                editCnt={editCnt}
                value={
                  editCnt
                    ? userData?.merchant?.merchantCode
                    : values?.merchant?.merchantCode
                }
                id="merchantCode"
                name="merchantCode"
                type="text"
              />

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                  User Information
                </h3>
              </div>

              <div className="space-y-6 sm:space-y-5 font-Inter">
                <FormInputFiled
                  disabled={editCnt}
                  label="First Name"
                  editCnt={editCnt}
                  value={
                    editCnt
                      ? userData?.firstName
                      : capitalizeFirst(values?.firstName).trimStart()
                  }
                  handleOnChange={handleChange}
                  placeholder="First Name"
                  id="firstName"
                  maxLength={35}
                  name="firstName"
                  type="text"
                  onBlur={handleBlur}
                  error={errors?.firstName}
                  errorStatus={touched?.firstName && Boolean(errors?.firstName)}
                />
                <FormInputFiled
                  disabled={editCnt}
                  label="Last Name"
                  editCnt={editCnt}
                  value={
                    editCnt
                      ? userData?.lastName
                      : capitalizeFirst(values?.lastName).trimStart()
                  }
                  handleOnChange={handleChange}
                  placeholder="Last Name"
                  id="lastName"
                  name="lastName"
                  maxLength={35}
                  type="text"
                  onBlur={handleBlur}
                  error={errors?.lastName}
                  errorStatus={touched?.lastName && Boolean(errors?.lastName)}
                />

                <FormInputFiled
                  disabled={true}
                  label="Email"
                  editCnt={editCnt}
                  value={userData?.email}
                  placeholder="Email"
                  id="email"
                  name="email"
                  type="text"
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-baseline sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="password"
                    className="block text-font_dark font-medium"
                  >
                    Password
                  </label>
                  <div className="mt-1 w-full sm:max-w-xs justify-between sm:col-span-2 sm:mt-0 max-w-lg ">
                    <div className="flex rounded-md font-normal ">
                      <input
                        // type="password"
                        name="password"
                        id="password"
                        maxLength={15}
                        placeholder="Password"
                        value="***************"
                        disabled={true}
                        className={
                          editCnt
                            ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                            : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                        }
                      />
                      {!editCnt && (
                        <button
                          type="button"
                          onClick={() => {
                            setresetPasswordModal(true);
                          }}
                          className="px-4 py-2 bg-button_color text-blue_primary rounded-r-md min-w-fit"
                        >
                          Reset Password
                        </button>
                      )}
                    </div>
                    {editCnt && (
                      <span className="text-sm text-table_head_color py-2 px-3">
                        (
                        {userData?.updatedAt
                          ? `last updated at ${moment(
                              userData?.updatedAt
                            ).format("YYYY-MM-DD HH:mm:ss")}`
                          : ""}
                        )
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="phoneno"
                    className="block text-font_dark font-medium"
                  >
                    Phone No.
                  </label>

                  {editCnt ? (
                    <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md sm:max-w-xs max-w-lg w-full">
                      <span className="block cursor-default w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                        +{values?.phoneCode} {values?.phoneNo}
                      </span>
                    </div>
                  ) : (
                    <div className=" items-center sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <div className="relative mt-1 flex items-center sm:col-span-2 sm:mt-0 max-w-lg sm:max-w-xs">
                        <Listbox
                          value={editCnt ? defaultFlag : selectedFlag}
                          onChange={onSelect}
                          disabled={editCnt}
                        >
                          {({ open }) => (
                            <>
                              <div className=" rounded-md mr-2 relative border border-grey_border">
                                <Listbox.Button className=" relative w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                                  <span className="flex items-center">
                                    {selectedFlag?.flag}
                                  </span>
                                  <span className=" pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>

                                <Transition
                                  show={open}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Listbox.Options className="absolute w-max min-w-[140px] z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {flagArray.map((flag, index) => (
                                      <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "bg-indigo-600"
                                              : "hover:text-font_black text-font_black",
                                            "block rounded-md relative cursor-pointer select-none py-2 pl-3 pr-9 border-grey_border_table focus:border-blue_primary"
                                          )
                                        }
                                        value={flag || ""}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              {flag.flag}
                                              <span
                                                className={classNames(
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal",
                                                  "ml-3 block truncate"
                                                )}
                                              >
                                                {flag.dialCode}
                                              </span>
                                            </div>

                                            {selected ? (
                                              <span
                                                className={classNames(
                                                  active
                                                    ? "text-white"
                                                    : "text-indigo-600",
                                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                                )}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                          )}
                        </Listbox>

                        <input
                          onChange={handleOnChange}
                          maxLength={32}
                          value={editCnt ? userData?.phoneNo : values?.phoneNo}
                          type="number"
                          name="phoneNo"
                          id="phoneNo"
                          disabled={editCnt}
                          placeholder="Phone No"
                          onBlur={handleBlur}
                          className={`block pr-10 w-full max-w-lg rounded-md ${
                            !editCnt && "border focus:text-font_black"
                          }  font-normal ${
                            touched?.phoneNo && Boolean(errors?.phoneNo)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary "
                          }   focus:outline-none sm:max-w-xs py-2 px-3 text-sm `}
                        />

                        {touched?.phoneNo && Boolean(errors?.phoneNo) && (
                          <div className="pointer-events-none absolute top-[9px] flex items-center right-3 bg-white">
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
                      </div>
                      {touched?.phoneNo && Boolean(errors?.phoneNo) && (
                        <span
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {errors?.phoneNo}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {!editCnt && !userData?.title ? (
                  <FormInputFiled
                    disabled={editCnt}
                    label="Title"
                    editCnt={editCnt}
                    value={editCnt ? userData?.title : values?.title}
                    handleOnChange={handleChange}
                    // placeholder="Title"
                    id="title"
                    name="title"
                    type="text"
                  />
                ) : (
                  userData?.title && (
                    <FormInputFiled
                      disabled={editCnt}
                      label="Title"
                      editCnt={editCnt}
                      value={editCnt ? userData?.title : values?.title}
                      handleOnChange={handleChange}
                      // placeholder="Title"
                      id="title"
                      name="title"
                      type="text"
                    />
                  )
                )}

                <FormInputFiled
                  disabled={true}
                  label="Last Login"
                  editCnt={editCnt}
                  value={
                    userData?.lastLogin
                      ? moment(userData?.lastLogin).format(
                          "YYYY/MM/DD HH:mm:ss"
                        )
                      : ""
                  }
                  handleOnChange={handleChange}
                  id="lastLogin"
                  name="lastLogin"
                  type="text"
                />
                <FormInputFiled
                  disabled={true}
                  label="Created On"
                  editCnt={editCnt}
                  value={
                    userData?.createdOn
                      ? moment(userData?.createdOn).format(
                          "YYYY/MM/DD HH:mm:ss"
                        )
                      : ""
                  }
                  id="createdOn"
                  name="createdOn"
                  type="text"
                />

                <FormInputFiled
                  disabled={true}
                  label="Created By"
                  editCnt={editCnt}
                  value={`${userData?.createdBy?.firstName} ${userData?.createdBy?.lastName}`}
                  id="createdBy"
                  name="createdBy"
                  type="text"
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-font_dark font-medium"
                  >
                    Preferred Language
                  </label>
                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md sm:max-w-xs max-w-lg w-full">
                    {editCnt ? (
                      <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                        {
                          languageArray?.find(
                            (x) => x?.code === values?.language
                          )?.name
                        }
                      </span>
                    ) : (
                      <select
                        disabled={editCnt}
                        value={
                          languageArray?.find(
                            (x) => x?.code === values?.language
                          )?.name
                        }
                        className={
                          editCnt
                            ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                            : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                        }
                        onChange={(e) => changeLanguageCalled(e)}
                      >
                        {languageArray?.map((x: any, i: number) => {
                          return <option key={i}>{x?.name}</option>;
                        })}
                      </select>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="active_state"
                    className="block text-font_dark font-medium"
                  >
                    Active
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    {editCnt ? (
                      <SwitchToggle
                        disabled={editCnt}
                        enabled={userData?.status === "ACTIVE"}
                      />
                    ) : (
                      <SwitchToggle
                        enabled={values.status === "ACTIVE"}
                        onChange={switchOnChange}
                      />
                    )}
                  </div>
                </div>

                {!apiError?.status && (
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:pt-5">
                    <span
                      className="mt-21 text-sm text-error_red"
                      id="email-error"
                    >
                      {apiError?.message}
                    </span>
                  </div>
                )}
              </div>

              <div>
                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      type="submit"
                      disabled={!dirty || isLoading}
                      className={`rounded-md ${
                        dirty
                          ? "bg-blue_primary hover:bg-hoverChange"
                          : "bg-grey_border_table_disable"
                      }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
                    >
                      {isLoading ? <ButtonSpinner /> : "Save Changes"}
                    </button>
                    <button
                      onClick={cancelClicked}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-grey_border_table hover:bg-grey_bg py-2 px-4 text-sm font-medium text-font_dark focus:outline-none  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <ResetPasswordModal
                  disableEyeIcon={true}
                  open={resetPasswordModal}
                  passwordError={resetPasswordErrors?.password}
                  confirm_passwordError={resetPasswordErrors?.confirm_password}
                  setOpen={setresetPasswordModal}
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
                  resetForm={resetPasswordResetForm}
                />
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
      </form>
    </div>
  ) : null;
}

export interface ErrorsState {
  [id: string]: string;
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
