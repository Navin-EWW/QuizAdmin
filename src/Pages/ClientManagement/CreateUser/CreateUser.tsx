import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { object, ref, string, number } from "yup";

import { flagArray as Flag } from "../../../Components/Flags";
import {
  CreateUserApI,
  MerchantListDropDown,
} from "../../../api/merchant/user";

import UseToast from "../../../hooks/useToast";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import _, { debounce, xor } from "lodash";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { capitalizeFirst } from "../../../utils/Capitalization";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import PhoneNumberValidator from "../../../utils/PhoneNumberValidator";
import { CountryCode } from "libphonenumber-js";
import { checkIfNumber } from "../../../utils/validators";

const language = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Chinese (Traditional)",
    code: "zh_CHT",
  },
  {
    name: "Chinese (Simplified)",
    code: "zh",
  },
];

export function CreateUser() {
  function sortFlag(a: any, b: any) {
    if (a.dialCode < b.dialCode) {
      return -1;
    }
    if (a.dialCode > b.dialCode) {
      return 1;
    }
    return 0;
  }

  const flagArray = Flag.sort(sortFlag);

  const navigate = useNavigate();
  const [passwordeye, setpassword] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [cnpasswordeye, setCnpassword] = useState(true);
  const [selected, setSelected] = useState<any>(flagArray[206]);
  const [merchantTypeD_D, setMerchantTypeD_D] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("HK");
  const [apiErrors, setapiErrors] = useState<any>("");
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }
  const onSelect = (e: any) => {
    const phoneCode = Number(e.dialCode.substring(1));
    setFieldValue("phoneCode", phoneCode);
    setSelected(e);
    setCountryCode(e.code);
  };

  const {
    mutate,
    isLoading,
    error: apierror,
  }: {
    mutate: UseMutateFunction<AxiosResponse<any, any>, unknown, any, unknown>;
    isLoading: boolean;
    error: any;
  } = useMutation(CreateUserApI, {
    onSuccess: (data: any) => {
      if (data?.status) {
        UseToast(data.message, "success");
        setShowDialog(false);
        successNavigate();
      }
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setapiErrors({ status: false, message: data })
        : setapiErrors(data);
    },
  });

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
    email: string()
      .required("Required Field")
      .trim("Required Field")
      .email("Invalid Email Format. Please try again."),
    password: string()
      .required("Required Field")
      .trim("Required Field")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can't start or end with a blank space."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Password must contain at least 8 characters, one uppercase, one lowercase and one number." ??
          ""
      )
      .max(15, "Maximun 15 characters are required in password."),
    phoneCode: string(),
    phoneNo: string()
      .required("Required Field")
      .trim("Required Field")
      .min(4, "Invalid phone number.")
      .max(32, "Too long")
      .test("errorPhoneNo", "Invalid phone number" ?? "", (value) => {
        return PhoneNumberValidator(value ?? "", countryCode);
      }),
    title: string().required("Required Field").trim("Required Field"),
    language: string().required("Required Field").trim("Required Field"),
    merchantId: string().required("Required Field").trim("Required Field"),
    confirm_password: string()
      .required("Required Field")
      .trim("Required Field")
      .oneOf([ref("password")], "Unmatch with inputted password."),
  });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    dirty,
    setErrors,
    setFieldValue,
  } = useFormik({
    validationSchema: UserBasicSchema,

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneCode: "",
      phoneNo: "",
      confirm_password: "",
      title: "",
      language: "",
      merchantId: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      const phoneCode = selected.dialCode
        .split("")
        .filter((value: any) => {
          return value !== "+";
        })
        .join("");
      mutate({
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email,
        password: values?.password,
        phoneCode:
          values?.phoneCode?.toString() ||
          selected?.dialCode?.substr(1)?.toString(),
        phoneNo: values?.phoneNo,
        title: values?.title,
        language: values?.language,
        merchantCode: values?.merchantId,
      });
    },

    // onReset: () => {},
  });

  const { dataUpdatedAt, error, isError, isFetching, refetch } = useQuery(
    ["MerchantListDropDown"],
    () => MerchantListDropDown(),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          setMerchantTypeD_D(data.data);
        }
      },
    }
  );

  const successNavigate = useCallback(
    debounce(() => navigate("/user/list"), 200),
    []
  );

  useMemo(() => {
    if (dirty) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [dirty]);
  const onCancel = () => {
    navigate("/user/list");
  };

  useEffect(() => {
    if (!apiErrors.status) {
      setTimeout(() => {
        setapiErrors("");
      }, 7000);
    }
  }, [apiErrors]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = _.get(e, "target.value");
    if (value !== " ") {
      if (value.length === 33) {
        return null;
      } else {
        setFieldValue("phoneNo", value);
      }
    }
  };

  return (
    <>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <div className="px-4 sm:px-6 lg:px-8 bg-background_grey">
        <div className="flex justify-between items-center py-5 ">
          <h1
            className="text-2xl font-semibold text-font_black"
            onClick={() => navigate("/user/add")}
          >
            + New User
          </h1>
        </div>
        <div className="">
          <form className="space-y-5 pb-20" onSubmit={handleSubmit}>
            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    Merchant Information
                  </h3>
                </div>
                <div className="space-y-6 sm:space-y-5 font-Inter">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Merchant Name*
                    </label>

                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          disabled={isLoading}
                          id="type"
                          name="merchantId"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.merchantId}
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched?.merchantId && Boolean(errors?.merchantId)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary"
                          } sm:max-w-xs focus:outline-none py-2 px-3 text-sm   active:border-blue_primary focus:text-font_black`}
                        >
                          <option value="">Merchant Name</option>
                          {merchantTypeD_D.map((item, index) => (
                            <option key={index} value={item.merchantCode}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-21 text-sm text-error_red">
                        {touched?.merchantId && Boolean(errors?.merchantId)
                          ? errors.merchantId
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="merchant-code"
                      className="block text-font_dark font-medium"
                    >
                      Merchant Code
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        maxLength={30}
                        type="text"
                        name="merchant-code"
                        id="merchant-code"
                        value={values.merchantId}
                        disabled
                        className="block w-full max-w-lg rounded-md font-normal border border-grey_border_table text-table_head_color focus:outline-none sm:max-w-xs py-2 px-3 text-sm  focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    User Information
                  </h3>
                </div>

                <div className="space-y-6 sm:space-y-5 font-Inter">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      First Name*
                    </label>

                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        disabled={isLoading}
                        type="text"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={capitalizeFirst(values.firstName)}
                        id="firstName"
                        maxLength={35}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched?.firstName && Boolean(errors?.firstName)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  active:border-blue_primary focus:text-font_black`}
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
                    <label className="block text-font_dark font-medium">
                      Last Name*
                    </label>

                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        disabled={isLoading}
                        type="text"
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        maxLength={35}
                        value={capitalizeFirst(values.lastName)}
                        id="lastName"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched?.lastName && Boolean(errors?.lastName)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />

                      {touched?.lastName && Boolean(errors?.lastName) && (
                        <div className="pointer-events-none absolute top-[9px]  flex items-center right-3 bg-white">
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

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched?.lastName && Boolean(errors?.lastName)
                          ? errors.lastName
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="email"
                      className="block text-font_dark font-medium"
                    >
                      Email*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        autoComplete="new-password"
                        disabled={isLoading}
                        type="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email.trim()}
                        name="email"
                        id="email"
                        className={`"block w-full max-w-lg rounded-md font-normal border ${
                          touched?.email && Boolean(errors?.email)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10   focus:text-font_black`}
                      />

                      {touched?.email && Boolean(errors?.email) && (
                        <div className="pointer-events-none absolute top-[9px]  flex items-center right-3 bg-white">
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

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched?.email && Boolean(errors?.email)
                          ? errors.email
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Password*
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="relative max-w-lg sm:max-w-xs">
                        <input
                          autoComplete="new-password"
                          disabled={isLoading}
                          type={passwordeye ? "password" : "text"}
                          name="password"
                          id="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          maxLength={15}
                          className={`block w-full rounded-md font-normal border ${
                            touched?.password && Boolean(errors?.password)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
                        />

                        <div className="absolute right-3 bottom-2">
                          {passwordeye ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              onClick={() => setpassword(!passwordeye)}
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 stroke-grey_border  cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              onClick={() => setpassword(!passwordeye)}
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 stroke-grey_border  cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-21 text-sm text-error_red">
                        {touched?.password && Boolean(errors?.password)
                          ? errors.password
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Repeat Password*
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="relative max-w-lg sm:max-w-xs">
                        <input
                          disabled={isLoading}
                          type={cnpasswordeye ? "password" : "text"}
                          name="confirm_password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.confirm_password.trimStart()}
                          id="cnpassword"
                          maxLength={15}
                          className={`block w-full rounded-md font-normal border ${
                            touched?.confirm_password &&
                            Boolean(errors?.confirm_password)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
                        />
                        <div className="absolute right-3 bottom-2">
                          {cnpasswordeye ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              onClick={() => setCnpassword(!cnpasswordeye)}
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 stroke-grey_border  cursor-pointer "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              onClick={() => setCnpassword(!cnpasswordeye)}
                              stroke="currentColor"
                              className="w-6 h-6 stroke-grey_border cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-21 text-sm text-error_red" id="error">
                        {touched?.confirm_password &&
                        Boolean(errors?.confirm_password)
                          ? errors.confirm_password
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="phoneno"
                      className="block text-font_dark font-medium"
                    >
                      Phone No.*
                    </label>
                    <div className="relative sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs flex gap-3">
                      <input
                        type="number"
                        name="phone-code"
                        id="phone-code"
                        className="w-1/5 block max-w-lg rounded-md font-normal border border-grey_border_table md:max-w-xs focus:outline-none py-2 px-3 text-sm  focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                        placeholder=""
                      />
                      <input
                        type="number"
                        name="phone-number"
                        id="phone-number"
                        className="w-4/5 block max-w-lg rounded-md font-normal border border-grey_border_table md:max-w-xs focus:outline-none py-2 px-3 text-sm  focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                        placeholder=""
                      />
                    </div>
                  </div> */}

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Phone No.*
                    </label>
                    <div className="relative  flex items-start sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <Listbox
                        value={selected || ""}
                        disabled={isLoading}
                        onChange={onSelect}
                      >
                        {({ open }) => (
                          <>
                            <div className=" rounded-md  min-h-[38px]  min-w-[68px] mr-2 relative border border-grey_border">
                              <Listbox.Button
                                //   onBlur={handleBlur}
                                className=" relative w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm"
                              >
                                <span className="flex items-center">
                                  {selected?.flag}
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
                                          "rounded-md relative cursor-pointer select-none py-2 pl-3 pr-9 focus:outline-none"
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

                      <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                        <input
                          disabled={isLoading}
                          // onKeyDown={(evt) =>
                          //   (evt.key === "e" ||
                          //     evt.key === "E" ||
                          //     evt.key === "+") &&
                          //   evt.preventDefault()
                          // }
                          onKeyDown={(event) => checkIfNumber(event)}
                          onBlur={handleBlur}
                          onChange={handleOnChange}
                          value={values.phoneNo}
                          type="number"
                          name="phoneNo"
                          id="phoneNo"
                          maxLength={32}
                          className={`rounded-md block w-full border py-2 px-3 focus:outline-none ${
                            touched?.phoneNo && Boolean(errors?.phoneNo)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          }  focus:text-font_black pr-10`}
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

                        <p
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {touched?.phoneNo && Boolean(errors?.phoneNo)
                            ? errors.phoneNo
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="title"
                      className="block text-font_dark font-medium"
                    >
                      Title
                    </label>

                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        disabled={isLoading}
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title.trimStart()}
                        name="title"
                        id="title"
                        maxLength={50}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched?.title && Boolean(errors?.title)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } sm:max-w-xs focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />

                      {touched?.title && Boolean(errors?.title) && (
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

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched?.title && Boolean(errors?.title)
                          ? errors.title
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Preferred Language*
                    </label>

                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          disabled={isLoading}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.language}
                          id="language"
                          name="language"
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched?.language && Boolean(errors?.language)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } sm:max-w-xs focus:outline-none py-2 px-3 text-sm   focus:text-font_black`}
                        >
                          <option className="" value="">
                            Prefered Language
                          </option>
                          {language?.map((lan, index) => (
                            <option key={index} value={lan.code}>
                              {lan.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched?.language && Boolean(errors?.language)
                          ? errors.language
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="error">
              {!apiErrors?.status && (
                <p className="text-error_red">{apiErrors?.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none min-w-[137.88px]  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                >
                  {isLoading ? <ButtonSpinner /> : "Create New User"}
                </button>
                <button
                  onClick={onCancel}
                  type="reset"
                  className="ml-3 inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
