import React, { useState, useEffect, useMemo } from "react";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import { useFormik } from "formik";
import DropDownField from "../../../Components/MultipleInputField/DropDownField";
import TextInputField from "../../../Components/MultipleInputField/TextInputField";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { flagArray as Flag } from "../../../Components/Flags";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CitiesDetails,
  StatesDetails,
  UpdateSenderDetails,
} from "../../../api/orderDetails/orderDetails.api";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import UseToast from "../../../hooks/useToast";
import parsePhoneNumber from "libphonenumber-js";
import { number, object, string } from "yup";
import _, { isEmpty } from "lodash";
import ButtonSpinner from "../../../utils/ButtonSpinner";

type Props = {
  editCnt: boolean;
  taxTypes: any;
  setEditCnt: any;
  cancelModal: boolean;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  senderDetails: any;
  idTypesDetails: any;
  compareToggle: boolean;
  tabRedirect: boolean;
  countriesDetails: any[];
  show: boolean;
  province?: string;
};

const SenderDetails = ({
  editCnt,
  senderDetails,
  setcancelModal,
  setcompareToggle,
  compareToggle,
  refetch,
  setEditCnt,
  show,
  idTypesDetails,
  tabRedirect,
  cancelModal,
  province,
  taxTypes,
  countriesDetails,
}: Props) => {
  const [stateDetails, setstateDetails] = useState<any[]>([]);
  const [cityDetails, setcityDetails] = useState<any[]>([]);
  const [apiError, setapiError] = useState<string>("");
  const [isOpenCountryCode, setisOpenCountryCode] = useState<boolean>(false);
  const [isOpenState, setisOpenState] = useState<boolean>(false);
  const [isOpenCity, setisOpenCity] = useState<boolean>(false);
  const [cityDetailsMutateValue, setcityDetailsMutateValue] =
    useState<boolean>(true);
  const [senderIdNoState, setsenderIdNoState] = useState<string>();
  const [senderTaxNoState, setsenderTaxNoState] = useState<string>();
  const [senderCountryCode, setsenderCountryCode] = useState<any>();
  const [senderCountryName, setsenderCountryName] = useState<any>();

  const { mutate } = useMutation(StatesDetails, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setstateDetails(data?.data);
        if (cityDetailsMutateValue) {
          const findIdCity: any = data?.data.find(
            (x: any) => x?.name === senderDetails?.senderProvince
          );

          if (!_.isEmpty(findIdCity)) {
            cityMutate(findIdCity?.id);
          }
        }
        setcityDetailsMutateValue(false);
        // setcityDetails([]);
      }
    },
    onError: (data) => {},
  });

  const { mutate: cityMutate } = useMutation(CitiesDetails, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setcityDetails(data?.data);
      }
    },
    onError: (data) => {},
  });

  const { mutate: senderMutate, isLoading } = useMutation(UpdateSenderDetails, {
    onSuccess: (data: any) => {
      refetch();
      setEditCnt(!editCnt);
      UseToast(data?.message);
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
      }, 11000);
    }
  }, [apiError]);

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

  const SenderDetailsSchema = object()
    .nullable()
    .shape({
      senderName: string().required("Required Field").nullable(),
      senderCompany: string().required("Required Field").nullable(),
      senderDistrict: string().nullable(),
      senderProvince: string().required("Required Field").nullable(),
      senderAddress: string().required("Required Field").nullable(),

      senderPhone: string()
        .required("Required Field")
        .matches(/^[()\-\s\d]+$/, "invalid phone number")
        .nullable(),

      senderPostCode: string().required("Required Field").nullable(),

      senderTaxNo: string()
        .nullable()
        .when("senderTaxType", (senderTaxType: any, schema: any) => {
          if (senderTaxType)
            return schema.required("Required Field").nullable();
          return schema;
        }),
      senderIdNo: string()
        .nullable()
        .when("senderIdType", (senderIdType: any, schema: any) => {
          if (senderIdType) return schema.required("Required Field").nullable();
          return schema;
        }),

      senderIdType: !_.isEmpty(senderIdNoState)
        ? string().required("Required Field").nullable()
        : string().nullable(),
      senderTaxType: !_.isEmpty(senderTaxNoState)
        ? string().required("Required Field").nullable()
        : string().nullable(),
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
    validationSchema: SenderDetailsSchema,
    enableReinitialize: true,
    initialValues: {
      senderName: senderDetails?.senderName,
      senderCompany: senderDetails?.senderCompany,
      senderCity: senderDetails?.senderCity,
      senderProvince: senderDetails?.senderProvince,
      senderDistrict: senderDetails?.senderDistrict,
      senderAddress: senderDetails?.senderAddress,
      senderCountry: senderDetails?.senderCountry,
      senderPostCode: senderDetails?.senderPostcode,
      senderPhone: senderDetails?.senderPhone,
      senderCountryCode: senderDetails?.senderCountryCode,
      senderEmail: senderDetails?.senderEmail,
      senderTaxNo: senderDetails?.tax?.senderTaxNumber || "",
      senderTaxType: senderDetails?.tax?.senderTaxNumberType || "",
      senderIdNo: senderDetails?.id?.senderIdNumber || "",
      senderIdType: senderDetails?.id?.senderIdNumberType || "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      let senderTaxTypeId = taxTypes?.values?.find(
        (x: any) => x?.value.trim() === values?.senderTaxType.trim()
      )?.id;
      let senderIdTypeId = idTypesDetails?.values?.find(
        (x: any) => x?.value.trim() === values?.senderIdType.trim()
      )?.id;

      senderMutate({
        senderName: values?.senderName,
        senderCompany: values?.senderCompany,
        senderCityId:
          cityDetails?.find((x: any) => x?.name === values?.senderCity)?.id ??
          null,
        senderProvinceId: stateDetails?.find(
          (x: any) => x?.name === values?.senderProvince
        )?.id,
        senderDistrict: values?.senderDistrict,
        senderAddress: values?.senderAddress,
        senderCountryId: countriesDetails?.find(
          (x: any) => x?.iso2 === values?.senderCountry
        )?.id,

        senderPostCode: values?.senderPostCode?.toString(),
        senderPhone: [values?.senderCountryCode, values?.senderPhone].join(""),
        senderEmail: values?.senderEmail || null,
        senderTaxNo: values?.senderTaxNo,
        senderTaxTypeId: senderTaxTypeId || null,
        senderIdNo: values?.senderIdNo,

        senderIdTypeId: senderIdTypeId || null,
        senderId: province,
      });
    },
  });

  const findCountryCode = () => {
    const findArray = flagArray?.find(
      (x) => x?.dialCode === senderDetails?.senderCountryCode
    );
    setsenderCountryCode(findArray);
    const countryName = flagArray?.find(
      (x) => x?.code === senderDetails?.senderCountry
    );
    setsenderCountryName(countryName?.country);
  };

  useMemo(() => {
    if (show) {
      const findIdState: any = countriesDetails.find(
        (x: any) => x?.iso2 === senderDetails?.senderCountry
      );

      mutate(findIdState?.id);
      setsenderIdNoState(senderDetails?.id?.senderIdNumber);
      setsenderTaxNoState(senderDetails?.tax?.senderTaxNumber);
      findCountryCode();
    }
  }, [show]);

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("senderName", senderDetails?.senderName);
    setFieldValue("senderCompany", senderDetails?.senderCompany);
    setFieldValue("senderCity", senderDetails?.senderCity);
    setFieldValue("senderProvince", senderDetails?.senderProvince);
    setFieldValue("senderDistrict", senderDetails?.senderDistrict);
    setFieldValue("senderAddress", senderDetails?.senderAddress);
    setFieldValue("senderCountry", senderDetails?.senderCountry);
    setFieldValue("senderPostCode", senderDetails?.senderPostcode);
    setFieldValue("senderPhone", senderDetails?.senderPhone);
    setFieldValue("senderCountryCode", senderDetails?.senderCountryCode);
    setFieldValue("senderEmail", senderDetails?.senderEmail);
    setFieldValue("senderTaxNo", senderDetails?.tax?.senderTaxNumber || "");
    setFieldValue(
      "senderTaxType",
      senderDetails?.tax?.senderTaxNumberType || ""
    );
    setFieldValue("senderIdNo", senderDetails?.id?.senderIdNumber || "");
    setFieldValue("senderIdType", senderDetails?.id?.senderIdNumberType || "");
    setsenderIdNoState(senderDetails?.id?.senderIdNumber || "");
    setsenderTaxNoState(senderDetails?.tax?.senderTaxNumber || "");
    setTouched({});
    findCountryCode();
    setapiError("");
  };

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  const onChangeCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const findId = countriesDetails.find((x) => x?.name === e);
    setFieldValue("senderCountry", findId?.iso2);
    setFieldValue("senderProvince", "");
    setFieldValue("senderCity", "");
    setsenderCountryName(e);
    setisOpenCountryCode(false);
    mutate(findId?.id);
  };

  const onChangeProvince = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    text?: string
  ) => {
    if (e !== text) {
      const findId: any = stateDetails.find((x: any) => x?.name === e);
      cityMutate(findId?.id);
      setFieldValue("senderProvince", e);
      setFieldValue("senderCity", "");
      setisOpenState(false);
    } else {
      setFieldValue("senderProvince", "");
      setFieldValue("senderCity", "");
      setisOpenCity(false);
    }
  };

  const onChangeState = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    text?: string
  ) => {
    if (e !== text) {
      setFieldValue("senderCity", e);
      setisOpenCity(false);
    } else {
      setFieldValue("senderCity", "");
      setisOpenCity(false);
    }
  };

  const cancelClicked = () => {
    if (dirty) {
      setcancelModal(true);
    } else {
      setEditCnt(!editCnt);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = _.get(e, "target.value");
    if (value !== " ") {
      if (value.length === 33) {
        return null;
      } else {
        setFieldValue("senderPhone", value);
      }
    }
  };

  return show ? (
    <div className="relative pb-10 mb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit}>
        <div className="bg-white px-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div
              className={`space-y-6 sm:space-y-5 ${
                !editCnt && "pb-5"
              } font-Inter`}
            >
              <FormInputFiled
                firstElement={true}
                disabled={editCnt || isLoading}
                label={editCnt ? `Sender Name` : "*Sender Name"}
                editCnt={editCnt}
                value={values?.senderName}
                handleOnChange={handleChange}
                placeholder=""
                id="senderName"
                name="senderName"
                type="text"
                onBlur={handleBlur}
                error={errors.senderName}
                errorStatus={touched?.senderName && Boolean(errors?.senderName)}
              />
              <FormInputFiled
                disabled={editCnt || isLoading}
                // firstElement={true}
                label={editCnt ? `Sender Company` : "*Sender Company"}
                editCnt={editCnt}
                value={values?.senderCompany}
                handleOnChange={handleChange}
                placeholder=""
                id="senderCompany"
                name="senderCompany"
                type="text"
                onBlur={handleBlur}
                error={errors.senderCompany}
                errorStatus={
                  touched?.senderCompany && Boolean(errors?.senderCompany)
                }
              />
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Origin
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    {editCnt ? "Country Code" : "*Country Code"}
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{`${values?.senderCountry}-${senderCountryName}`}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        isOpen={isOpenCountryCode}
                        setIsOpen={setisOpenCountryCode}
                        array={countriesDetails}
                        isCountryDropdown={true}
                        value={`${values?.senderCountry}-${senderCountryName}`}
                        id="senderCountry"
                        name="senderCountry"
                        divOnClick={() => {
                          setisOpenState(false), setisOpenCity(false);
                        }}
                        onchangeValue={onChangeCountry}
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
                    )}
                  </div>
                </div>
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    {editCnt ? "Province" : "*Province"}
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{values?.senderProvince}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.senderProvince)}
                        text="Select a proper Details"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          onChangeProvince(e, "Select a proper Details");
                        }}
                        isOpen={isOpenState}
                        divOnClick={() => {
                          setisOpenCountryCode(false), setisOpenCity(false);
                        }}
                        setIsOpen={setisOpenState}
                        array={stateDetails}
                        value={values?.senderProvince}
                        id="senderProvince"
                        name="senderProvince"
                        errorStatus={
                          touched?.senderProvince &&
                          Boolean(errors?.senderProvince)
                        }
                        error={errors?.senderProvince}
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
                    )}
                  </div>
                </div>
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    {editCnt ? "City" : " *City"}
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{values?.senderCity}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.senderCity)}
                        divOnClick={() => {
                          setisOpenCountryCode(false), setisOpenState(false);
                        }}
                        isOpen={isOpenCity}
                        setIsOpen={setisOpenCity}
                        array={cityDetails}
                        value={values?.senderCity}
                        text="Select a proper Details"
                        id="senderCity"
                        name="senderCity"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          onChangeState(e, "Select a proper Details");
                        }}
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
                    )}
                  </div>
                </div>

                {/* <DropDownField
                  label="*City"
                  editCnt={editCnt}
                  title={values?.senderCity}
                  array={cityDetails}
                  onChangeCountry={onChangeState}
                /> */}

                <TextInputField
                  disabled={isLoading}
                  name="senderDistrict"
                  id="senderDistrict"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="District"
                  editCnt={editCnt}
                  errorStatus={
                    touched?.senderDistrict && Boolean(errors?.senderDistrict)
                  }
                  error={errors?.senderDistrict}
                  title={values?.senderDistrict}
                />
                {/* <TextInputField
                  disabled={isLoading}
                  name="senderAddress"
                  id="senderAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={editCnt ? "Address" : "*Address"}
                  isAddress={true}
                  editCnt={editCnt}
                  errorStatus={
                    touched?.senderAddress && Boolean(errors?.senderAddress)
                  }
                  error={errors?.senderAddress}
                  title={values?.senderAddress}
                /> */}
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    {editCnt ? "Address" : "*Address"}
                  </label>
                  <div className="mt-1 sm:col-span-3 sm:mt-0">
                    <textarea
                      style={{
                        resize: editCnt ? "none" : "vertical",
                      }}
                      name="senderAddress"
                      id="senderAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.senderAddress}
                      // placeholder=""
                      disabled={editCnt}
                      rows={values?.senderAddress.length > 60 ? 3 : 1}
                      className={
                        editCnt
                          ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                          : `block w-full  rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none  py-2 px-3 text-sm `
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="phoneno"
                  className="block text-font_dark font-medium"
                >
                  {editCnt ? "Sender Phone" : " *Sender Phone"}
                </label>

                {editCnt ? (
                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                    <span>{`${values?.senderCountryCode} ${values?.senderPhone}`}</span>
                  </div>
                ) : (
                  <Listbox
                    value={senderCountryCode}
                    disabled={editCnt || isLoading}
                    onChange={(e: any) => {
                      setFieldValue("senderCountryCode", e?.dialCode),
                        setsenderCountryCode(e);
                    }}
                  >
                    {({ open }) => (
                      <>
                        <div className="relative sm:col-span-2 sm:mt-0 mt-1 max-w-lg sm:max-w-md flex gap-3">
                          <div>
                            <Listbox.Button
                              //   onBlur={handleBlur}
                              className="relative block lg:w-[148px] lg:min-w-[148px] md:w-[130px] md:min-w-[30px] h-full rounded-md font-normal border border-grey_border_table focus:outline-none py-2 px-3 text-sm text-table_head_color focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                              // className=" relative w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm"
                            >
                              <div className="flex items-center gap-2 text-font_black">
                                {senderCountryCode?.flag}
                                {""}
                                {senderCountryCode?.dialCode}
                              </div>
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
                              <Listbox.Options className="absolute z-10 mt-1 left-0 right-0 top-9 w-[148px] max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {flagArray.map((flag, index) => (
                                  <Listbox.Option
                                    key={flag.dialCode}
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
                          <div className="relative">
                            <input
                              onBlur={handleBlur}
                              onChange={handleOnChange}
                              disabled={editCnt}
                              value={values?.senderPhone?.replace(/\s/g, "")}
                              type="text"
                              //   onKeyDown={blockInvalidChar}
                              name="senderPhone"
                              id="senderPhone"
                              maxLength={32}
                              className={`block w-full max-w-lg rounded-md font-normal border ${
                                touched?.senderPhone &&
                                Boolean(errors?.senderPhone)
                                  ? "border-error_red text-error_text"
                                  : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                              } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                              placeholder="Sender Phone"
                            />

                            {touched?.senderPhone &&
                              Boolean(errors?.senderPhone) && (
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

                            {touched?.senderPhone &&
                              Boolean(errors?.senderPhone) && (
                                <p
                                  className="mt-21 text-sm text-error_red"
                                  id="email-error"
                                >
                                  {errors.senderPhone?.toString()}
                                </p>
                              )}
                          </div>
                        </div>
                      </>
                    )}
                  </Listbox>
                )}
              </div>

              <FormInputFiled
                disabled={editCnt || isLoading}
                label={editCnt ? "Sender Post Code" : "*Sender Post Code"}
                editCnt={editCnt}
                value={values?.senderPostCode}
                handleOnChange={handleChange}
                placeholder=""
                id="senderPostCode"
                name="senderPostCode"
                type="number"
                onBlur={handleBlur}
                error={errors.senderPostCode}
                errorStatus={
                  touched?.senderPostCode && Boolean(errors?.senderPostCode)
                }
              />
              <FormInputFiled
                disabled={editCnt || isLoading}
                label={`Sender Email`}
                editCnt={editCnt}
                value={values?.senderEmail}
                handleOnChange={handleChange}
                placeholder=""
                id="senderEmail"
                name="senderEmail"
                type="text"
                onBlur={handleBlur}
                error={errors.senderEmail}
                errorStatus={
                  touched?.senderEmail && Boolean(errors?.senderEmail)
                }
              />
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Tax
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  disabled={isLoading}
                  name="senderTaxNo"
                  id="senderTaxNo"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("senderTaxNo", e?.target?.value);
                    setsenderTaxNoState(e?.target?.value);
                  }}
                  onBlur={handleBlur}
                  label="Number"
                  editCnt={editCnt}
                  title={values?.senderTaxNo}
                  error={errors.senderTaxNo}
                  errorStatus={
                    touched?.senderTaxNo && Boolean(errors?.senderTaxNo)
                  }
                />
                <DropDownField
                  disabled={isLoading}
                  onChangeCountry={(e: any) => {
                    if (e?.target?.value === "Select a type") {
                      setFieldValue("senderTaxType", "");
                    } else {
                      setFieldValue("senderTaxType", e?.target?.value);
                    }
                  }}
                  label="Type"
                  editCnt={editCnt}
                  isSelectType={true}
                  array={taxTypes?.values}
                  isSystemVariable={true}
                  onBlur={handleBlur}
                  title={values?.senderTaxType.trim()}
                  error={errors.senderTaxType}
                  errorStatus={
                    touched?.senderTaxType && Boolean(errors?.senderTaxType)
                  }
                />
              </div>
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    ID
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  disabled={isLoading}
                  name="senderIdNo"
                  id="senderIdNo"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("senderIdNo", e?.target?.value);
                    setsenderIdNoState(e?.target?.value);
                  }}
                  onBlur={handleBlur}
                  label="Number"
                  editCnt={editCnt}
                  title={values?.senderIdNo}
                  error={errors.senderIdNo}
                  errorStatus={
                    touched?.senderIdNo && Boolean(errors?.senderIdNo)
                  }
                />
                <DropDownField
                  disabled={isLoading}
                  onChangeCountry={(e: any) => {
                    if (e?.target?.value === "Select a type") {
                      setFieldValue("senderIdType", "");
                    } else {
                      setFieldValue("senderIdType", e?.target?.value);
                    }
                  }}
                  label="Type"
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={idTypesDetails?.values}
                  isSelectType={true}
                  isSystemVariable={true}
                  title={values?.senderIdType.trim()}
                  error={errors.senderIdType}
                  errorStatus={
                    touched?.senderIdType && Boolean(errors?.senderIdType)
                  }
                />
              </div>
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                {apiError && (
                  <p className="mt-21 text-sm text-error_red" id="email-error">
                    {apiError}
                  </p>
                )}

                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || !dirty}
                      className={`rounded-md ${
                        dirty
                          ? "bg-blue_primary hover:bg-hoverChange"
                          : "bg-grey_border_table_disable"
                      }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none`}
                    >
                      {isLoading ? <ButtonSpinner /> : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none hover:bg-grey_bg tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                      onClick={cancelClicked}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default SenderDetails;
