import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import _, { debounce } from "lodash";
import { Outlet, useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { flagArray as Flag } from "../../../Components/Flags";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { object, ref, string, number, array } from "yup";

import { useFormik } from "formik";
import {
  MerchantType,
  CreateMerchantApI,
} from "../../../api/merchant/merchant";
import UseToast from "../../../hooks/useToast";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import { AxiosResponse } from "axios";
import { capitalizeFirst } from "../../../utils/Capitalization";
import PhoneNumberValidator from "../../../utils/PhoneNumberValidator";

// @ts-ignore
import { CountryCode } from "libphonenumber-js";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import NumberFormatInput from "../../../Components/NumberFormatInput/NumberFormatInput";

import { TextFormatInput } from "../../../Components/TextFormatInput/TextFormatInput";
import { checkIfNumber } from "../../../utils/validators";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";

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

export function CreateMerchant() {
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
  const [isOpenCountryCode, setisOpenCountryCode] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(flagArray[206]);
  const [merchanttype, setMerchanttype] = useState<[]>([]);
  const [apierror, setapierror] = useState<any>("");
  const [passwordeye, setpassword] = useState(true);
  const [cnpasswordeye, setCnpassword] = useState(true);
  const [serviceLan, setServiceLan] = useState<string>("");
  const [countryCode, setCountryCode] = useState<CountryCode>("HK");
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState<boolean>(false);

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
    isLoading: isloading,
  }: {
    mutate: UseMutateFunction<AxiosResponse<any, any>, unknown, any, unknown>;
    isLoading: any;
  } = useMutation(CreateMerchantApI, {
    onSuccess: (data: any) => {
      if (data) {
        UseToast(data.message, "success");
        setShowDialog(false);
        successNavigate();
      }
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setapierror({ status: false, message: data })
        : setapierror(data);
    },
  });

  const blockInvalidChar = (e: any) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const MerchentBasicSchema = object().shape({
    name: string()
      .required("Required Field")
      // .max(35, "Too long")
      .min(2, "Name must contain 2 or more characters. please try again")
      .matches(/^[A-Za-z\s]+$/, "First name must contain alphabet "),
    legalEntityName: string()
      .required("Required Field")
      // .max(35, "Too long")
      .min(
        2,
        "Legal entity name must contain 2 or more characters. please try again."
      ),
    // .matches(/^[A-Za-z\s]+$/, "First name must contain alphabet "),
    merchantCode: string().required("Required Field"),
    description: string(),
    address: string().required("Required Field"),
    type: string().required("Required Field"),
    creditPeriod: string()
      .required("Required Field")
      .max(2, "Credit period must be 2 characters"),
    businessRegistration: string().required("Required Field"),
    idCard: string(),
    // preferredServiceLane_origin: string().required("Required Field"),
    // preferredServiceLane_destination: string().required("Required Field"),
    country: string().required("Required Field"),
    firstName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "First name must contain alphabet ")
      .max(35, "Too long")
      .min(2, "First name must contain 2 or more characters. please try again"),
    lastName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "Last name must contain alphabet ")
      .max(35, "Too long")
      .min(2, "Last name must contain 2 or more characters. please try again"),
    email: string()
      .email("Invalid Email Format. Please try again.")
      .required("Required Field"),
    password: string()
      .required("Required Field")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      )
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,15}$/,
        "Password must be 8-15 Characters Long, one uppercase, one lowercase and one number." ??
          ""
      ),
    confirm_password: string()
      .required("Required Field")
      .oneOf(
        [ref("password")],
        "New password and confirm password does not match"
      ),
    phoneCode: string(),
    phoneNo: string()
      .required("Required Field")
      .max(32, "Invalid phone number")
      .test("errorPhoneNo", "Invalid phone number" ?? "", (value) => {
        return PhoneNumberValidator(value ?? "", countryCode);
      }),
    title: string().max(50, "Too long"),
    language: string().required("Required Field"),
  });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    setValues,
    setErrors,
    touched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: MerchentBasicSchema,

    initialValues: {
      name: "",
      legalEntityName: "",
      merchantCode: "A",
      description: "",
      address: "",
      type: "",
      creditPeriod: "",
      businessRegistration: "",
      idCard: "",
      preferredServiceLane_origin: "",
      preferredServiceLane_destination: "",
      country: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
      phoneCode: "",
      phoneNo: "",
      title: "",
      language: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({
        name: values.name,
        legalEntityName: values.legalEntityName,
        description: values.description,
        address: values.address,
        type: values.type,
        creditPeriod: values.creditPeriod,
        businessRegistration: values.businessRegistration.replace(/\s/g, ""),
        idCard: values.idCard,
        country: values.country,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneCode: String(values.phoneCode) || selected?.dialCode?.substr(1),
        phoneNo: String(values.phoneNo),
        title: values.title,
        language: values.language,
        code: flagArray.filter((data) => data.country === values?.country)[0]
          .code,
      });

      const phoneCode = selected.dialCode
        .split("")
        .filter((value: any) => {
          return value !== "+";
        })
        .join("");
    },
  });

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(["MerchantType"], () => MerchantType(), {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          setMerchanttype(data.data.types);
        }
      },
    });

  useMemo(() => {
    if (dirty) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [dirty]);

  const successNavigate = useCallback(
    debounce(() => navigate("/merchant/list"), 200),
    []
  );

  const onCancel = () => {
    navigate("/merchant/list");
  };

  useEffect(() => {
    if (!apierror.status) {
      setTimeout(() => {
        setapierror("");
      }, 7000);
    }
  }, [apierror]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = _.get(e, "target.value");
    if (value !== " ") {
      // if (value !== "+" && value !== "-") {
      if (value.length === 33) {
        return null;
      } else {
        setFieldValue("phoneNo", value);
      }
      // }
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
            onClick={() => navigate("/merchant/add")}
          >
            + New Merchant
          </h1>
        </div>
        <div className="">
          <form
            className="space-y-5 pb-20"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    Basic Information
                  </h3>
                </div>
                <div className="space-y-6 sm:space-y-5 font-Inter">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="merchant-name"
                      className="block text-font_dark font-medium"
                    >
                      Merchant Name*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        onBlur={handleBlur}
                        // maxLength={35}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(values.name).trimStart()}
                        type="text"
                        name="name"
                        id="merchantname"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched?.name && Boolean(errors?.name)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary "
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm  active:border-blue_primary focus:text-font_black`}
                      />

                      {touched?.name && Boolean(errors?.name) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched?.name && Boolean(errors?.name)
                          ? errors.name
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="entity-name"
                      className="block text-font_dark font-medium"
                    >
                      Legal Entity Name*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        type="text"
                        name="legalEntityName"
                        onBlur={handleBlur}
                        // maxLength={35}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(
                          values.legalEntityName
                        ).trimStart()}
                        id="entity-name"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.legalEntityName &&
                          Boolean(errors.legalEntityName)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />

                      {touched?.legalEntityName &&
                        Boolean(errors?.legalEntityName) && (
                          <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                            <svg
                              className="h-5 w-5 fill-error_red"
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
                        {touched.legalEntityName &&
                        Boolean(errors.legalEntityName)
                          ? errors.legalEntityName
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="description"
                      className="block text-font_dark font-medium"
                    >
                      Description
                    </label>

                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        type="text"
                        name="description"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(values.description).trimStart()}
                        id="description"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.description && Boolean(errors.description)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />
                      {touched?.description && Boolean(errors?.description) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched.description && Boolean(errors.description)
                          ? errors.description
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="address"
                      className="block text-font_dark font-medium"
                    >
                      Address*
                    </label>
                    <div className="max-w-[520px] relative mt-1 rounded-md sm:col-span-2 sm:mt-0 w-full">
                      <input
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(values.address)}
                        name="address"
                        id="address"
                        // maxLength={120}
                        className={`block w-full rounded-md font-normal border ${
                          touched.address && Boolean(errors.address)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />

                      {touched?.address && Boolean(errors?.address) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched.address && Boolean(errors.address)
                          ? errors.address
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="type"
                      className="block text-font_dark font-medium"
                    >
                      Type*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <select
                        id="type"
                        name="type"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={values.type}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.type && Boolean(errors.type)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`}
                      >
                        <option value="">Type</option>
                        {merchanttype?.map((type) => (
                          <option key={type} value={type}>
                            {type === "DirectCustomer"
                              ? "Direct Customer"
                              : type}
                          </option>
                        ))}
                      </select>

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.type && Boolean(errors.type)
                          ? errors.type
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Country*
                    </label>

                    {/* <div className="items-center sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          id="country"
                          name="country"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isloading}
                          value={values.country}
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched.country && Boolean(errors.country)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm  focus:text-font_black`}
                        >
                          <option value="">Country</option>
                          {flagArray.map((flag, index) => (
                            <option key={flag.code} value={flag.country}>
                              {flag.country}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.country && Boolean(errors.country)
                          ? errors.country
                          : ""}
                      </p>
                    </div> */}

                    <div className="items-center sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <InputDropDown
                          disabled={isLoading}
                          noValueHere={_.isEmpty(values?.country)}
                          text="Country"
                          onchangeValue={(
                            e: React.ChangeEvent<HTMLInputElement>,
                            text: string
                          ) => {
                            setFieldValue("country", e);
                          }}
                          isOpen={isOpenCountryCode}
                          setIsOpen={setisOpenCountryCode}
                          // divOnClick={() => {
                          //   setisOpenCountryCode(false), setisOpenCity(false);
                          // }}
                          array={flagArray.map((flag, index) => ({
                            name: flag.country,
                            iso2: flag.code,
                          }))}
                          value={values?.country}
                          errorStatus={
                            touched?.country && Boolean(errors?.country)
                          }
                          error={errors?.country}
                          id="country"
                          name="country"
                          onBlur={handleBlur}
                          iconsvg={
                            <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                                fill="#6B7B80"
                              />
                            </svg>
                          }
                        />
                      </div>

                      {/* <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.country)}
                        text="Country"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          setFieldValue("country", e);
                        }}
                        isOpen={isOpenCountryCode}
                        setIsOpen={setisOpenCountryCode}
                        // divOnClick={() => {
                        //   setisOpenCountryCode(false), setisOpenCity(false);
                        // }}
                        array={flagArray.map((flag, index) => ({
                          name: flag.country,
                          iso2: flag.code,
                        }))}
                        value={values?.country}
                        errorStatus={
                          touched?.country && Boolean(errors?.country)
                        }
                        error={errors?.country}
                        id="country"
                        name="country"
                        onBlur={handleBlur}
                        iconsvg={
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                              fill="#6B7B80"
                            />
                          </svg>
                        }
                      />
                    </div> */}
                    </div>
                  </div>

                  {/* <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="country"
                      className="block text-font_dark font-medium"
                    >
                      Service Lane*
                    </label>
                    <div className="mt-1 items-center sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <div className=" flex mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          id="OriginCountry"
                          name="preferredServiceLane_origin"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.preferredServiceLane_origin}
                          placeholder="Origin Country"
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched.preferredServiceLane_origin &&
                            Boolean(errors.preferredServiceLane_origin)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`}
                        >
                          <option value="">Origin Country</option>
                          {flagArray.map((flag, index) => (
                            <option key={flag.code} value={flag.code}>
                              {flag.country}
                            </option>
                          ))}
                        </select>

                        <select
                          id="DestinationCountry"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.preferredServiceLane_destination}
                          name="preferredServiceLane_destination"
                          placeholder="Destination Country"
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched.preferredServiceLane_destination &&
                            Boolean(errors.preferredServiceLane_destination)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table"
                          } focus:outline-none sm:max-w-xs py-2 ml-3 px-3 text-sm   focus:text-font_black`}
                        >
                          <option value="">Destination Country</option>
                          {flagArray.map((flag, index) => (
                            <option key={flag.code} value={flag.code}>
                              {flag.country}
                            </option>
                          ))}
                        </select>
                      </div>

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.preferredServiceLane_origin &&
                        touched.preferredServiceLane_destination &&
                        Boolean(errors.language)
                          ? errors.preferredServiceLane_origin
                          : ""}
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    Detail Information
                  </h3>
                </div>
                <div className="space-y-6 sm:space-y-5 font-Inter">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="credit_term"
                      className="block text-font_dark font-medium"
                    >
                      Credit Term*
                    </label>

                    <div className="relative group  mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <select
                        id="creditPeriod"
                        name="creditPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={values.creditPeriod}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.creditPeriod && Boolean(errors.creditPeriod)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`}
                      >
                        <option value="">Day(s)</option>

                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                      </select>

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.creditPeriod && Boolean(errors.creditPeriod)
                          ? errors.creditPeriod
                          : ""}
                      </p>
                    </div>
                  </div>

                  <TextFormatInput
                    formatType="### ### ### ### ### ### ### ### ### ### ### ###"
                    disabled={false}
                    label={`Business Registration*`}
                    editCnt={false}
                    defaultValue={values?.businessRegistration}
                    onChange={(e) => {
                      setValues({ ...values, businessRegistration: e });
                    }}
                    id="businessRegistration"
                    name="businessRegistration"
                    onBlur={handleBlur}
                    error={errors?.businessRegistration}
                    errorStatus={
                      touched?.businessRegistration &&
                      Boolean(errors?.businessRegistration)
                    }
                  />

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="card"
                      className="block text-font_dark font-medium"
                    >
                      ID Card
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        type="text"
                        name="idCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={values.idCard.trimStart()}
                        id="card"
                        maxLength={35}
                        placeholder=""
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.idCard && Boolean(errors.idCard)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm  pr-10 focus:text-font_black`}
                      />
                      {touched?.idCard && Boolean(errors?.idCard) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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

                      +

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.idCard && Boolean(errors.idCard)
                          ? errors.idCard
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    Master User Information
                  </h3>
                </div>
                <div className="space-y-6 sm:space-y-5 font-Inter">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="first-name"
                      className="block text-font_dark font-medium"
                    >
                      Master User First Name*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        type="text"
                        name="firstName"
                        id="first-name"
                        maxLength={35}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(values.firstName).trimStart()}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.firstName && Boolean(errors.firstName)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />
                      {touched?.firstName && Boolean(errors?.firstName) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched.firstName && Boolean(errors.firstName)
                          ? errors.firstName
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="last-name"
                      className="block text-font_dark font-medium"
                    >
                      Master User Last Name*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        type="text"
                        name="lastName"
                        maxLength={35}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={capitalizeFirst(values.lastName).trimStart()}
                        id="last-name"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.lastName && Boolean(errors.lastName)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10 focus:text-font_black`}
                      />
                      {touched?.lastName && Boolean(errors?.lastName) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched.lastName && Boolean(errors.lastName)
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
                      Master User Email*
                    </label>
                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        autoComplete="new-password"
                        type="text"
                        name="email"
                        id="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={values.email.trimStart()}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.email && Boolean(errors.email)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />
                      {touched?.email && Boolean(errors?.email) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                        {touched.email && Boolean(errors.email)
                          ? errors.email
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="password"
                      className="block text-font_dark font-medium"
                    >
                      Master User Password*
                    </label>
                    <div className="items-center sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <div className="relative max-w-lg sm:max-w-xs">
                          <input
                            autoComplete="new-password"
                            type={passwordeye ? "password" : "text"}
                            name="password"
                            id="password"
                            maxLength={15}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isloading}
                            value={values.password.trimStart()}
                            className={`block w-full max-w-lg rounded-md font-normal border ${
                              touched.password && Boolean(errors.password)
                                ? "border-error_red text-error_text"
                                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                            } focus:outline-none sm:max-w-xs py-2 px-3 pr-10 text-sm   focus:text-font_black`}
                          />
                          <div className="absolute right-3 bottom-2">
                            {passwordeye ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => setpassword(!passwordeye)}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 stroke-grey_border cursor-pointer "
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
                                onClick={() => setpassword(!passwordeye)}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
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
                        <p
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {touched.password && Boolean(errors.password)
                            ? errors.password
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="confirm_password"
                      className="block text-font_dark font-medium"
                    >
                      Repeat User Password*
                    </label>

                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="relative max-w-lg sm:max-w-xs">
                        <input
                          type={cnpasswordeye ? "password" : "text"}
                          name="confirm_password"
                          id="confirm_password"
                          onBlur={handleBlur}
                          maxLength={15}
                          onChange={handleChange}
                          disabled={isloading}
                          value={values.confirm_password.trimStart()}
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched.confirm_password &&
                            Boolean(errors.confirm_password)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs pr-10 py-2 px-3 text-sm   focus:text-font_black`}
                        />
                        <div className="absolute right-3 bottom-2">
                          {cnpasswordeye ? (
                            <svg
                              onClick={() => setCnpassword(!cnpasswordeye)}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 stroke-grey_border cursor-pointer"
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
                              onClick={() => setCnpassword(!cnpasswordeye)}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
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
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.confirm_password &&
                        Boolean(errors.confirm_password)
                          ? errors.confirm_password
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="phoneno"
                      className="block text-font_dark font-medium"
                    >
                      Master User Phone No.*
                    </label>

                    <div className="relative  flex items-start sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-xs">
                      <Listbox
                        value={selected || countryCode}
                        disabled={isloading}
                        onChange={onSelect}
                      >
                        {({ open }) => (
                          <>
                            <div className=" rounded-md mr-2 relative border min-w-[68px] min-h-[39px] border-grey_border">
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
                      {/* setFieldValue('location', location) */}
                      <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                        <input
                          onBlur={handleBlur}
                          onChange={handleOnChange}
                          disabled={isloading}
                          value={values.phoneNo}
                          onKeyDown={(event) => checkIfNumber(event)}
                          type="number"
                          // onKeyDown={blockInvalidChar}
                          name="phoneNo"
                          id="phoneNo"
                          maxLength={32}
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched.phoneNo && errors.phoneNo
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                          placeholder=""
                        />

                        {touched?.phoneNo && Boolean(errors?.phoneNo) && (
                          <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                            <svg
                              className="h-5 w-5 fill-error_red"
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
                      Master User Title
                    </label>

                    <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                      <input
                        onBlur={handleBlur}
                        disabled={isloading}
                        onChange={handleChange}
                        value={values.title.trimStart()}
                        type="text"
                        name="title"
                        maxLength={50}
                        id="title"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.title && Boolean(errors.title)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                      />

                      {touched?.title && Boolean(errors?.title) && (
                        <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 fill-error_red"
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
                            >
                              ,
                            </path>
                          </svg>
                        </div>
                      )}
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.title && Boolean(errors.title)
                          ? errors.title
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label
                      htmlFor="language"
                      className="block text-font_dark font-medium"
                    >
                      Preferred language*
                    </label>

                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <select
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={isloading}
                        value={values.language}
                        id="language"
                        name="language"
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched.language && Boolean(errors.language)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`}
                      >
                        <option value="">Perferred language</option>
                        {language?.map((lan, index) => (
                          <option key={index} value={lan.code}>
                            {lan.name}
                          </option>
                        ))}
                      </select>

                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {touched.language && Boolean(errors.language)
                          ? errors.language
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="error mt-2">
                    {!apierror.status ? (
                      <p className="text-error_red">{apierror?.message}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={() => handleSubmit}
                  className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm min-w-[181px] font-medium text-white focus:outline-none flex justify-center "
                >
                  {isloading ? <ButtonSpinner /> : "Create New Merchant"}
                </button>
                <button
                  type="reset"
                  onClick={onCancel}
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
