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
  UpdateReceiverDetails,
} from "../../../api/orderDetails/orderDetails.api";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import UseToast from "../../../hooks/useToast";
import { number, object, string } from "yup";
import _ from "lodash";
import { Typecity, Typestate } from "../../../utils/types";
import ButtonSpinner from "../../../utils/ButtonSpinner";

type Props = {
  editCnt: boolean;
  taxTypes: any;
  setEditCnt: any;
  cancelModal: boolean;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  receiverDetails: any;
  idTypesDetails: any;
  compareToggle: boolean;
  tabRedirect: boolean;
  countriesDetails: any[];
  show: boolean;
  province?: string;
};

const ReceiverDetails = ({
  editCnt,
  receiverDetails,
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
  const [stateDetails, setstateDetails] = useState<Typestate[]>([]);
  const [cityDetails, setcityDetails] = useState<Typecity[]>([]);
  const [apiError, setapiError] = useState<string>("");
  const [isOpenCountryCode, setisOpenCountryCode] = useState<boolean>(false);
  const [isOpenState, setisOpenState] = useState<boolean>(false);
  const [isOpenCity, setisOpenCity] = useState<boolean>(false);
  const [cityDetailsMutateValue, setcityDetailsMutateValue] =
    useState<boolean>(true);
  const [receiverIdNoState, setreceiverIdNoState] = useState<string>();
  const [receiverTaxNoState, setreceiverTaxNoState] = useState<string>();
  const [receiverCountryCode, setreceiverCountryCode] = useState<any>();
  const [receiverCountryName, setreceiverCountryName] = useState<any>();

  const { mutate } = useMutation(StatesDetails, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setstateDetails(data?.data);
        if (cityDetailsMutateValue) {
          const findIdCity: any = data?.data.find(
            (x: any) => x?.name === receiverDetails?.receiverProvince
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

  const { mutate: receiverMutate, isLoading } = useMutation(
    UpdateReceiverDetails,
    {
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
    }
  );

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

  const receiverDetailsSchema = object().shape({
    receiverName: string().required("Required Field").nullable(),
    receiverCompany: string().required("Required Field").nullable(),
    receiverDistrict: string().nullable(),
    receiverProvince: string().required("Required Field").nullable(),

    receiverAddress: string().required("Required Field").nullable(),

    receiverPhone: string()
      .required("Required Field")
      .matches(/^[()\-\s\d]+$/, "invalid phone number"),

    receiverPostCode: string().required("Required Field").nullable(),

    receiverTaxNo: string()
      .nullable()
      .when("receiverTaxType", (receiverTaxType: any, schema: any) => {
        if (receiverTaxType)
          return schema.required("Required Field").nullable();
        return schema;
      }),
    receiverIdNo: string()
      .nullable()

      .when("receiverIdType", (receiverIdType: any, schema: any) => {
        if (receiverIdType) return schema.required("Required Field").nullable();
        return schema;
      }),
    receiverIdType: !_.isEmpty(receiverIdNoState)
      ? string().required("Required Field").nullable()
      : string().nullable(),
    receiverTaxType: !_.isEmpty(receiverTaxNoState)
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
    validationSchema: receiverDetailsSchema,
    enableReinitialize: true,
    initialValues: {
      receiverName: receiverDetails?.receiverName,
      receiverCompany: receiverDetails?.receiverCompany,
      receiverCity: receiverDetails?.receiverCity,
      receiverProvince: receiverDetails?.receiverProvince,
      receiverDistrict: receiverDetails?.receiverDistrict,
      receiverAddress: receiverDetails?.receiverAddress,
      receiverCountry: receiverDetails?.receiverCountry,
      receiverPostCode: receiverDetails?.receiverPostCode,
      receiverPhone: receiverDetails?.receiverPhone,
      receiverCountryCode: receiverDetails?.receiverCountryCode,
      receiverEmail: receiverDetails?.receiverEmail,
      receiverTaxNo: receiverDetails?.tax?.receiverTaxNo || "",
      receiverTaxType: receiverDetails?.tax?.receiverTaxType || "",
      receiverIdNo: receiverDetails?.id?.receiverIdNo || "",
      receiverIdType: receiverDetails?.id?.receiverIdType || "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      receiverMutate({
        receiverName: values?.receiverName,
        receiverCompany: values?.receiverCompany,
        receiverCityId:
          cityDetails?.find((x: any) => x?.name === values?.receiverCity)?.id ??
          null,
        receiverProvinceId: stateDetails?.find(
          (x: any) => x?.name === values?.receiverProvince
        )?.id,
        receiverDistrict: values?.receiverDistrict,
        receiverAddress: values?.receiverAddress,
        receiverCountryId: countriesDetails?.find(
          (x: any) => x?.iso2 === values?.receiverCountry
        )?.id,

        receiverPostCode: values?.receiverPostCode?.toString(),
        receiverPhone: [
          values?.receiverCountryCode,
          values?.receiverPhone,
        ].join(""),
        receiverEmail: values?.receiverEmail,
        receiverTaxNo: values?.receiverTaxNo,
        receiverTaxTypeId:
          taxTypes?.values?.find(
            (x: any) => x?.value.trim() === values?.receiverTaxType.trim()
          )?.id || null,
        receiverIdNo: values?.receiverIdNo,

        receiverIdTypeId:
          idTypesDetails?.values?.find(
            (x: any) => x?.value.trim() === values?.receiverIdType.trim()
          )?.id || null,
        receiverId: province,
      });
    },
  });

  const findCountryCode = () => {
    const findArray = flagArray?.find(
      (x) => x?.dialCode === receiverDetails?.receiverCountryCode
    );
    setreceiverCountryCode(findArray);
    const countryName = flagArray?.find(
      (x) => x?.code === receiverDetails?.receiverCountry
    );
    setreceiverCountryName(countryName?.country);
  };

  useMemo(() => {
    if (show) {
      const findIdState = countriesDetails.find(
        (x: any) => x?.iso2 === receiverDetails?.receiverCountry
      );

      mutate(findIdState?.id);
      setreceiverIdNoState(receiverDetails?.id?.receiverIdNo);
      setreceiverTaxNoState(receiverDetails?.tax?.receiverTaxNo);
      findCountryCode();
    }
  }, [show]);

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("receiverName", receiverDetails?.receiverName);
    setFieldValue("receiverCompany", receiverDetails?.receiverCompany);
    setFieldValue("receiverCity", receiverDetails?.receiverCity);
    setFieldValue("receiverProvince", receiverDetails?.receiverProvince);
    setFieldValue("receiverDistrict", receiverDetails?.receiverDistrict);
    setFieldValue("receiverAddress", receiverDetails?.receiverAddress);
    setFieldValue("receiverCountry", receiverDetails?.receiverCountry);
    setFieldValue("receiverPostCode", receiverDetails?.receiverPostCode);
    setFieldValue("receiverPhone", receiverDetails?.receiverPhone);
    setFieldValue("receiverCountryCode", receiverDetails?.receiverCountryCode);
    setFieldValue("receiverEmail", receiverDetails?.receiverEmail);
    setFieldValue("receiverTaxNo", receiverDetails?.tax?.receiverTaxNo || "");
    setFieldValue(
      "receiverTaxType",
      receiverDetails?.tax?.receiverTaxType || ""
    );
    setFieldValue("receiverIdNo", receiverDetails?.id?.receiverIdNo || "");
    setFieldValue("receiverIdType", receiverDetails?.id?.receiverIdType || "");
    setreceiverIdNoState(receiverDetails?.id?.receiverIdNo || "");
    setreceiverTaxNoState(receiverDetails?.tax?.receiverTaxNo || "");
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
    setFieldValue("receiverCountry", findId?.iso2);
    setFieldValue("receiverProvince", "");
    setFieldValue("receiverCity", "");
    setreceiverCountryName(e);
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
      setFieldValue("receiverProvince", e);
      setFieldValue("receiverCity", "");
      setisOpenState(false);
    } else {
      setFieldValue("receiverProvince", "");
      setFieldValue("receiverCity", "");
      setisOpenCity(false);
    }
  };

  const onChangeState = (
    e: React.ChangeEvent<HTMLInputElement> | any,
    text?: string
  ) => {
    if (e !== text) {
      setFieldValue("receiverCity", e);
      setisOpenCity(false);
    } else {
      setFieldValue("receiverCity", "");
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
        setFieldValue("receiverPhone", value);
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
                label={editCnt ? "Receiver Name" : `*Receiver Name`}
                editCnt={editCnt}
                value={values?.receiverName}
                handleOnChange={handleChange}
                placeholder=""
                id="receiverName"
                name="receiverName"
                type="text"
                onBlur={handleBlur}
                error={errors.receiverName}
                errorStatus={
                  touched?.receiverName && Boolean(errors?.receiverName)
                }
              />
              <FormInputFiled
                disabled={editCnt || isLoading}
                label={editCnt ? "Receiver Company" : `*Receiver Company`}
                editCnt={editCnt}
                value={values?.receiverCompany}
                handleOnChange={handleChange}
                placeholder=""
                id="receiverCompany"
                name="receiverCompany"
                type="text"
                onBlur={handleBlur}
                error={errors.receiverCompany}
                errorStatus={
                  touched?.receiverCompany && Boolean(errors?.receiverCompany)
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
                    {editCnt ? "Country Code" : `*Country Code`}
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{`${values?.receiverCountry}-${receiverCountryName}`}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        isOpen={isOpenCountryCode}
                        setIsOpen={setisOpenCountryCode}
                        isCountryDropdown={true}
                        array={countriesDetails}
                        value={`${values?.receiverCountry}-${receiverCountryName}`}
                        id="receiverCountry"
                        name="receiverCountry"
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
                        <span>{values?.receiverProvince}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.receiverProvince)}
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
                        value={values?.receiverProvince}
                        errorStatus={
                          touched?.receiverProvince &&
                          Boolean(errors?.receiverProvince)
                        }
                        error={errors?.receiverProvince}
                        id="receiverProvince"
                        name="receiverProvince"
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
                    {editCnt ? "City" : "*City"}
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{values?.receiverCity}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.receiverCity)}
                        text="Select a proper Details"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          onChangeState(e, "Select a proper Details");
                        }}
                        divOnClick={() => {
                          setisOpenCountryCode(false), setisOpenState(false);
                        }}
                        isOpen={isOpenCity}
                        setIsOpen={setisOpenCity}
                        array={cityDetails}
                        value={values?.receiverCity}
                        id="receiverCity"
                        name="receiverCity"
                        // onchangeValue={onChangeState}
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
                  title={values?.receiverCity}
                  array={cityDetails}
                  onChangeCountry={onChangeState}
                /> */}
                <TextInputField
                  disabled={isLoading}
                  name="receiverDistrict"
                  id="receiverDistrict"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="District"
                  editCnt={editCnt}
                  errorStatus={
                    touched?.receiverDistrict &&
                    Boolean(errors?.receiverDistrict)
                  }
                  error={errors?.receiverDistrict}
                  title={values?.receiverDistrict}
                />
                {/* <TextInputField
                  disabled={isLoading}
                  name="receiverAddress"
                  id="receiverAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={editCnt ? "Address" : "*Address"}
                  isAddress={true}
                  editCnt={editCnt}
                  errorStatus={
                    touched?.receiverAddress && Boolean(errors?.receiverAddress)
                  }
                  error={errors?.receiverAddress}
                  title={values?.receiverAddress}
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
                      disabled={isLoading}
                      name="receiverAddress"
                      id="receiverAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.receiverAddress}
                      rows={values?.receiverAddress.length > 60 ? 3 : 1}
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
                  {editCnt ? "Receiver Phone" : "*Receiver Phone"}
                </label>

                {editCnt ? (
                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                    <span>
                      {`${values?.receiverCountryCode} ${values?.receiverPhone}`}
                    </span>
                  </div>
                ) : (
                  <Listbox
                    value={receiverCountryCode}
                    disabled={editCnt || isLoading}
                    onChange={(e: any) => {
                      setFieldValue("receiverCountryCode", e?.dialCode),
                        setreceiverCountryCode(e);
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
                                {receiverCountryCode?.flag}
                                {""}
                                {receiverCountryCode?.dialCode}
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
                              disabled={editCnt || isLoading}
                              value={values?.receiverPhone}
                              type="text"
                              //   onKeyDown={blockInvalidChar}
                              name="receiverPhone"
                              id="receiverPhone"
                              maxLength={32}
                              className={`block w-full max-w-lg rounded-md font-normal border ${
                                touched?.receiverPhone &&
                                Boolean(errors?.receiverPhone)
                                  ? "border-error_red text-error_text"
                                  : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                              } focus:outline-none sm:max-w-xs py-2 px-3 text-sm pr-10  focus:text-font_black`}
                              placeholder="Receiver Phone"
                            />

                            {touched?.receiverPhone &&
                              Boolean(errors?.receiverPhone) && (
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

                            {touched?.receiverPhone &&
                              Boolean(errors?.receiverPhone) && (
                                <p
                                  className="mt-21 text-sm text-error_red"
                                  id="email-error"
                                >
                                  {errors.receiverPhone?.toString()}
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
                label={editCnt ? "Receiver Post Code" : "*Receiver Post Code"}
                editCnt={editCnt}
                value={values?.receiverPostCode}
                handleOnChange={handleChange}
                placeholder=""
                id="receiverPostCode"
                name="receiverPostCode"
                type="number"
                onBlur={handleBlur}
                error={errors.receiverPostCode}
                errorStatus={
                  touched?.receiverPostCode && Boolean(errors?.receiverPostCode)
                }
              />
              <FormInputFiled
                disabled={editCnt || isLoading}
                label={`Receiver Email`}
                editCnt={editCnt}
                value={values?.receiverEmail}
                handleOnChange={handleChange}
                placeholder=""
                id="receiverEmail"
                name="receiverEmail"
                type="text"
                onBlur={handleBlur}
                error={errors.receiverEmail}
                errorStatus={
                  touched?.receiverEmail && Boolean(errors?.receiverEmail)
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
                  name="receiverTaxNo"
                  id="receiverTaxNo"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("receiverTaxNo", e?.target?.value);
                    setreceiverTaxNoState(e?.target?.value);
                  }}
                  onBlur={handleBlur}
                  label="text"
                  editCnt={editCnt}
                  title={values?.receiverTaxNo}
                  error={errors.receiverTaxNo}
                  errorStatus={
                    touched?.receiverTaxNo && Boolean(errors?.receiverTaxNo)
                  }
                />
                <DropDownField
                  disabled={isLoading}
                  onChangeCountry={(e: any) => {
                    if (e?.target?.value === "Select a type") {
                      setFieldValue("receiverTaxType", "");
                    } else {
                      setFieldValue("receiverTaxType", e?.target?.value);
                    }
                  }}
                  label="Type"
                  editCnt={editCnt}
                  isSelectType={true}
                  array={taxTypes?.values}
                  isSystemVariable={true}
                  onBlur={handleBlur}
                  title={values?.receiverTaxType.trim()}
                  error={errors.receiverTaxType}
                  errorStatus={
                    touched?.receiverTaxType && Boolean(errors?.receiverTaxType)
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
                  name="receiverIdNo"
                  id="receiverIdNo"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("receiverIdNo", e?.target?.value);
                    setreceiverIdNoState(e?.target?.value);
                  }}
                  onBlur={handleBlur}
                  label="Number"
                  editCnt={editCnt}
                  title={values?.receiverIdNo}
                  error={errors.receiverIdNo}
                  errorStatus={
                    touched?.receiverIdNo && Boolean(errors?.receiverIdNo)
                  }
                />
                <DropDownField
                  disabled={isLoading}
                  onChangeCountry={(e: any) => {
                    if (e?.target?.value === "Select a type") {
                      setFieldValue("receiverIdType", "");
                    } else {
                      setFieldValue("receiverIdType", e?.target?.value);
                    }
                  }}
                  label="Type"
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={idTypesDetails?.values}
                  isSelectType={true}
                  isSystemVariable={true}
                  title={values?.receiverIdType.trim()}
                  error={errors.receiverIdType}
                  errorStatus={
                    touched?.receiverIdType && Boolean(errors?.receiverIdType)
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
                      disabled={isLoading}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-grey_border_table  hover:bg-grey_bg py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
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

export default ReceiverDetails;
